import json
from helper_functions import send_email, fetch_and_process_trending_items, generate_html_report, transform_and_append_sources, summarize_sources, categorize_and_structure_keywords, generate_category_summaries, build_welcome_message_with_summaries
from collections import defaultdict

def main(event, context):

    # Grab time period from the event (default is daily)
    time_period = event.get('time_period', 'weekly')

    # 1. Get ids for each keyword of interest based on the config.py file
    final_results = fetch_and_process_trending_items(time_period)

    # 2. Transform and append sources to each result
    transformed_results = transform_and_append_sources(final_results)

    keywords_only = [item['keyword'] for item in transformed_results if 'keyword' in item]
    print("keywords found: ", keywords_only)

    # 3. Get summaries for each keyword with openai
    transformed_results_with_summaries = summarize_sources(transformed_results, time_period)

    # 4. Transform and build a new object to group summaries/keywords by category
    keywords_categories = categorize_and_structure_keywords(transformed_results_with_summaries)

    # 5. Get category summaries with the keyword summaries
    keyword_categories_with_summaries = generate_category_summaries(keywords_categories, time_period)

    # 6. Buil a welcome message with the category summaries
    final_object = build_welcome_message_with_summaries(keyword_categories_with_summaries, time_period)
    
    # Sort the 'categories' list in place, moving "Keywords of Interest" to the end
    final_object['categories'].sort(key=lambda x: x['category'] == "Keywords of Interest")

    # Generate the HTML for the email
    email = generate_html_report(final_object, time_period)

    # Send email
    send_email(email, time_period)

    return {
        'statusCode': 200,
        'body': json.dumps('Execution successful')
    }
