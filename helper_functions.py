import requests
import boto3
from openai import OpenAI
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
from collections import defaultdict
from urllib.parse import quote
import os

# Configs & System Templates
from config import WORD_COUNT, CATEGORY_LIMITS, KEYWORDS_OF_INTEREST, MODEL_NAME, NAME, CATEGORIES_OF_INTEREST, SOURCE_EMAIL, TO_ADRESS, AWS_REGION_NAME
from templates import trending_keyword_summary_template, interest_keyword_summary_template, trending_category_summary_template, interest_category_summary_template, welcome_message_summary_template, personality

sourceMapping = {
    "subjects": "Subjects",
    "companies": "Companies & Organizations",
    "ai": "AI Models & Assistants",
    "frameworks": "Frameworks & Libraries",
    "languages": "Languages & Syntax",
    "concepts": "Concepts & Methods",
    "tools": "Tools & Services",
    "platforms": "Platforms & Search Engines",
    "hardware": "Hardware & Systems",
    "websites": "Websites & Applications",
    "people": "People",
    "bucket": "Bucket (other)"
}

#############

# fetch keyword data/stats via https://public.api.safron.io/v2/keywords (see https://docs.safron.io/keywords#public-v2)
def fetch_and_process_trending_items(time_period):
    print("...fetch keywords")
    final_results = []

    inverse_mapping = {v: k for k, v in sourceMapping.items()}

    for short_name, full_name in sourceMapping.items():
        if full_name in CATEGORY_LIMITS:
            limit = CATEGORY_LIMITS[full_name]
            if limit == 0:
                continue
            
            params = {
                "category": short_name,
                "period": time_period,
                "slim": "false",
                "limit": limit,
                "sort": "trending"
            }
            response = requests.get("https://public.api.safron.io/v2/keywords", params=params)
            if response.status_code != 200:
                print(f"Failed to fetch data for category '{full_name}'. Status code: {response.status_code}")
                continue
            
            data = response.json()
            keywords = data.get("keywords", [])
            sorted_keywords = sorted(
                [item for item in keywords if item.get("trending", False)],
                key=lambda x: x.get("engagement", 0),
                reverse=True
            )[:limit]
            final_results.extend(sorted_keywords)

    for keyword in KEYWORDS_OF_INTEREST:
        encoded_keyword = quote(keyword) 
        params = {
            "search": encoded_keyword,
            "period": time_period,
            "slim": "false",
            "limit": 1 
        }
        response = requests.get("https://public.api.safron.io/v2/keywords", params=params)
        if response.status_code == 200:
            data = response.json()
            keywords = data.get("keywords", [])
            if keywords:
                final_results.extend(keywords)

    for category in CATEGORIES_OF_INTEREST:
        short_category = inverse_mapping.get(category)  
        if not short_category:
            print(f"No short mapping found for category '{category}'. Skipping.")
            continue

        params = {
            "category": short_category,
            "period": time_period,
            "slim": "false",
            "limit": 2,  
            "sort": "top"
        }
        response = requests.get("https://public.api.safron.io/v2/keywords", params=params)
        if response.status_code == 200:
            data = response.json()
            keywords = data.get("keywords", [])
            final_results.extend(keywords)

    return final_results


##################### 

# Fetch sources for the keywords via https://public.api.safron.io/v2/sources (see https://docs.safron.io/sources#public-v2)
def transform_and_append_sources(final_results, max_retries=2):
    print("...transform_and_append_sources")
    transformed_results = []

    for result in final_results:
        source_ids = result.get("sources", [])
        keyword = result.get("keyword", "Unknown")

        if not source_ids:
            print(f"No source IDs found for keyword: {keyword}. Skipping this keyword entirely.")
            continue 

        attempts = 0
        success = False
        while attempts < max_retries and not success:
            try:
                params = {"limit": 120}
                payload = {"ids": source_ids}

                response = requests.post(
                    "https://public.api.safron.io/v2/sources",
                    params=params,
                    json=payload
                )
                response.raise_for_status()  
                articles_data = response.json()
                articles_to_process = articles_data.get("articles", [])

                if articles_to_process: 
                    simplified_articles = [{
                        "text": article.get("text", ""),
                        "published": article.get("published", ""),
                        "source": article.get("source", ""),
                        "type": article.get("type", ""),
                        "sentiment_label": article.get("sentiment", ""),
                        "url": article.get("link", ""),
                        "relevance": article.get("engagement", "")
                    } for article in articles_to_process]

                    simplified_result = {
                        "keyword": keyword,
                        "count": result.get("count", 0),
                        "category": result.get("category", "Unknown"),
                        "trending": result.get("trending", False),
                        "sources": simplified_articles
                    }
                    transformed_results.append(simplified_result)
                    success = True

            except requests.exceptions.RequestException as e:
                attempts += 1
                print(f"Attempt {attempts} failed for keyword '{keyword}'. Error: {e}")

        if not success:
            print(f"All retries failed for keyword '{keyword}'. This keyword will be removed from the results.")

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
                    "source": source['source']
                })
                seen_titles.add(trimmed_and_lowered_title)
            
            if len(trimmed_sources) == 2:
                break

        keyword_structure = {
            "keyword": keyword_obj['keyword'],
            "trending": keyword_obj['trending'],
            "summary": keyword_obj['summary'],
            "top_sources": trimmed_sources
        }
        categories[keyword_obj['category']].append(keyword_structure)

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
        formatted_template = interest_category_summary_template.format(personality=personality, time_period=time_period)

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
                .trending {{ font-weight: bold; }}
            </style>
        </head>
        <body>
            <h1>Ciao {NAME}! The {time_period.capitalize()} Trending Tech Report</h1>
            <p>{data['welcome_message']}</p>
            <div class="divider"></div>
    """
    
    for category in data['categories']:
        html_content += f"<h2>{category['category']}</h2>"
        html_content += f"<p>{category['category_summary']}</p>"
        
        # Sort keywords so that trending ones come first
        sorted_keywords = sorted(category['keywords'], key=lambda x: x['trending'], reverse=True)
        
        for keyword in sorted_keywords:
            trending_mark = "(Trending)" if keyword['trending'] else ""
            html_content += f"<h3>{keyword['keyword']} {trending_mark}</h3>"
            html_content += f"<p>{keyword['summary']}</p>"
            html_content += f"<h4>Source(s)</h4>"
            html_content += "<ul>"
            for source in keyword['top_sources']:
                title = source['text']
                url = source['url']
                source_name = source['source']
                trimmed_title = (title[:147] + '...') if len(title) > 150 else title
                html_content += f'<li><a href="{url}">{trimmed_title} (Source: {source_name})</a></li>'
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