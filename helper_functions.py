import requests
import boto3
from openai import OpenAI
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
from collections import defaultdict
import os

# Configs & System Templates
from config import WORD_COUNT, CATEGORY_LIMITS, KEYWORDS_OF_INTEREST, MODEL_NAME, NAME, CATEGORIES_OF_INTEREST, SOURCE_EMAIL, TO_ADRESS, AWS_REGION_NAME
from templates import trending_keyword_summary_template, interest_keyword_summary_template, trending_category_summary_template, interest_category_summary_template, welcome_message_summary_template, personality

#############

# Get keywords from https://safron.io/api/table based on config.py
def fetch_and_process_trending_items(time_period):
    print("...fetch keywords")
    response = requests.get(f"https://safron.io/api/table?period={time_period}")
    if response.status_code != 200:
        raise Exception("Failed to fetch data from API")
    
    data = response.json()
    categories_of_interest_dict = {item["category"]: item["limit"] for item in CATEGORIES_OF_INTEREST}

    # making sure that the data is updated to yesterday (or else we throw an error)
    update_date = datetime.strptime(data["update_date"], "%Y-%m-%d").date()
    if update_date != (datetime.now() - timedelta(days=1)).date():
        raise Exception("Update date is not yesterday")

    filtered_results = [
        item for item in data["results"]
        if item["trending"] or item["keyword"] in KEYWORDS_OF_INTEREST
    ]

    final_results = []
    categories_selected = defaultdict(int)

    for item in filtered_results:
        if item["keyword"] in KEYWORDS_OF_INTEREST:
            final_results.append(item)
            categories_selected[item["category"]] += 1

    for category, limit in categories_of_interest_dict.items():
        category_items = [item for item in filtered_results if item["category"] == category]
        category_items_sorted = sorted(category_items, key=lambda x: x.get('rank', 0), reverse=True)[:limit]
        for item in category_items_sorted:
            if item not in final_results:
                final_results.append(item)
                categories_selected[category] += 1

    for item in filtered_results:
        if item["trending"] and item["keyword"] not in KEYWORDS_OF_INTEREST:
            category = item["category"]
            if categories_selected[category] < CATEGORY_LIMITS.get(category, 0) and category != "Bucket (other)" and category not in categories_of_interest_dict:
                final_results.append(item)
                categories_selected[category] += 1

    return final_results

##################### 

# Get sources from https://safron.io/api/sources
def transform_and_append_sources(final_results):
    print("...transform_and_append_sources")
    transformed_results = []

    for result in final_results:
        row_ids = result["row_ids"]
        simplified_result = {
            "keyword": result["keyword"],
            "count": result["count"],
            "category": result["category"],
            "trending": result["trending"]
        }
        try:
            response = requests.post("https://safron.io/api/sources", json={"ids": row_ids})
            response.raise_for_status()
            articles_data = response.json()

            # Process only up to the first 130 articles if more than 130 articles are returned (as we have a token limit)
            articles_to_process = articles_data["articles"][:130]

            simplified_articles = [{
                "text": article["text"],
                "published": article["published"],
                "source": article["source"],
                "medium": article["medium"],
                "relevance": article["relevance"],
                "sentiment_label": article["sentiment_label"],
                "url": article["url"],
                "type": article["type"]
            } for article in articles_to_process]

            simplified_result["sources"] = simplified_articles
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch or process articles for row_ids {row_ids}. Error: {e}")
            simplified_result["sources"] = [] 

        transformed_results.append(simplified_result)

    return transformed_results

#############

# OpenAI Function
def generate_response_openai(message, system_template):

    client = OpenAI();
    # Remember to set your API key via export in the terminal
    client.api_key = os.getenv("OPENAI_API_KEY")
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": system_template
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.3,
        max_tokens=356,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    if response.choices:
        return response.choices[0].message.content
    else:
        return "No response generated."

#############
    
# Get summaries of keywords
def summarize_sources(data, time_period):
    print("...summarize_sources")

    for result in data:
        
        if result['trending']:
            formatted_template = trending_keyword_summary_template.format(personality=personality, time_period=time_period, word_count=WORD_COUNT)
        else:
            formatted_template = interest_keyword_summary_template.format(personality=personality, time_period=time_period, word_count=WORD_COUNT)

        sources_text = '\n'.join([f"Text: {source['text']}\nURL: {source['url']}\nSource: {source['source']}\nRelevance: {source['relevance']}\nAnalyzed Sentiment: {source['sentiment_label']}" for source in result['sources']])
        message = f"Keyword: {result['keyword']}\n Category: {result['category']}\n Summarize the following sources:\n{sources_text}"
        summary = generate_response_openai(message, formatted_template)
        result['summary'] = summary
    
    return data

#############
    
# Structure the data
def categorize_and_structure_keywords(keyword_data):
    categories = defaultdict(list)

    for keyword_obj in keyword_data:
        filtered_sources = [source for source in keyword_obj['sources'] if source['type'] != 'comment']
        
        trimmed_sources = []
        seen_titles = set()

        for source in filtered_sources:
            trimmed_and_lowered_title = source['text'].strip().lower()

            if trimmed_and_lowered_title not in seen_titles:
                trimmed_sources.append({
                    "text": source['text'],
                    "url": source['url'],
                    "source": source['source'],
                    "medium": source['medium']
                })
                seen_titles.add(trimmed_and_lowered_title)
            
            if len(trimmed_sources) == 2:
                break

        category = keyword_obj['category'] if keyword_obj.get('trending', False) else "Keywords of Interest"
        keyword_structure = {
            "keyword": keyword_obj['keyword'],
            "summary": keyword_obj['summary'],
            "top_sources": trimmed_sources
        }
        categories[category].append(keyword_structure)

    final_output = {
        "categories": [
            {
                "category": cat,
                "keywords": data
            } for cat, data in categories.items()
        ]
    }

    return final_output

#############
    
# Generate category summaries of the keyword summaries
def generate_category_summaries(categories, time_period):
    print("...generate category summaries")

    for category in categories['categories']:
        if category['category'] == 'Keywords of Interest':
            formatted_template = interest_category_summary_template.format(personality=personality, time_period=time_period)
        else:
            formatted_template = trending_category_summary_template.format(personality=personality, time_period=time_period)

        combined_summaries = f"Summaries to summarize for the category {category['category']}:\n\n"
        
        for keyword in category['keywords']:
            combined_summaries += keyword['summary'] + "\n\n"

        combined_summaries = combined_summaries.rstrip('\n')
        category_summary = generate_response_openai(combined_summaries, formatted_template)
        category['category_summary'] = category_summary

    return categories

#############
    
# Build a welcome message
def build_welcome_message_with_summaries(categories_data, time_period):
    print("... build welcome message")
    all_summaries = "All Summaries:\n\n"
    formatted_template = welcome_message_summary_template.format(personality=personality, time_period=time_period, name=NAME)
    
    for category in categories_data['categories']:
        if 'category_summary' in category and category['category'] != 'Keywords of Interest':
            all_summaries += f"Summary for {category['category']}:\n{category['category_summary']}\n\n"
    
    all_summaries = all_summaries.rstrip('\n')
    welcome_message = generate_response_openai(all_summaries, formatted_template)
    final_output = {
        "categories": categories_data['categories'],
        "welcome_message": welcome_message
    }

    return final_output

#############
    
# Generate the HTML for the email
def generate_html_report(data, time_period):
    html_content = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Calibri, sans-serif; }}
                h1 {{ color: #333; font-size: 1.2rem; }}
                h2 {{ color: #666; font-size: 1.1rem; }}
                h3 {{ color: #888; font-size: 1rem;}}
                h4 {{ color: #888; font-size: 0.8rem;}}
                p, li {{ color: #444; }}
                ul, li {{
                    margin: 0;
                    padding: 0;
                    list-style-type: none;
                }}
                .divider {{ margin-top: 20px; margin-bottom: 20px; border-bottom: 1px solid #ccc; }}
            </style>
        </head>
        <body>
            <h1>Ciao {NAME}! Tha {time_period.capitalize()} Trending Tech Report</h1>
            <p>{data['welcome_message']}</p>
            <div class="divider"></div>
    """
    
    for category in data['categories']:

        html_content += f"<h2>{category['category']}</h2>"
        html_content += f"<p>{category['category_summary']}</p>"
        
        for keyword in category['keywords']:
            html_content += f"<h3>{keyword['keyword']}</h3>"
            html_content += f"<p>{keyword['summary']}</p>"
            html_content += f"<h4>Source(s)</h4>"
            html_content += "<ul>"
            for source in keyword['top_sources']:
                title = source['text']
                url = source['url']
                source_name = source['source']
                medium = source['medium']
                trimmed_title = (title[:147] + '...') if len(title) > 150 else title
                html_content += f'<li><a href="{url}">{trimmed_title} (Source: {medium} at {source_name})</a></li>'
            html_content += "</ul>"
        
        html_content += '<div class="divider"></div>'
    
    html_content += """
        </body>
    </html>
    """
    
    return html_content

#############

# Send email function with AWS SES
def send_email(html_message, time_period):
    print("... send email")
    ses_client = boto3.client('ses', region_name=AWS_REGION_NAME)  # Specify the AWS region
    try:
        response = ses_client.send_email(
            Source=SOURCE_EMAIL,  # The email address verified with SES
            Destination={
                'ToAddresses': [
                    TO_ADRESS,
                ]
            },
            Message={
                'Subject': {
                    'Data': f"{time_period.capitalize()} Update",
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': html_message,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        print("Email sent! Message ID:"),
        print(response['MessageId'])
    except ClientError as e:
        print(e.response['Error']['Message'])
    return {
        'statusCode': 200,
        'body': 'Email sent successfully!'
    }