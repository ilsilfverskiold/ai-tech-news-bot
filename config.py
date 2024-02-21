# Set your name
NAME = "Ida"

# Choose your OpenAI Model (Chat only) - GPT-3.5 Turbo is 13x cheaper than GPT-4
MODEL_NAME = "gpt-3.5-turbo-0125"

# Word count for keyword summaries (the longer the more detailed the summaries will be)
WORD_COUNT = '150'

# Define category limits for the trending keywords - it will grab by top count first (check safron.io to look over your options)
CATEGORY_LIMITS = {
    "Subjects": 3,
    "Tools & Services": 3,
    "Websites & Applications": 3,
    "Concepts & Methods": 3,
    "Platforms & Search Engines": 3,
    "Companies & Organizations": 3,
    "Hardware & Systems": 3,
    "Languages & Syntax": 3,
    "Frameworks & Libraries": 3,
    "People": 3,
    "AI Models & Assistants": 3
}

# Set your keywords of interest - should always be there regardless if they are trending yesterday or not
KEYWORDS_OF_INTEREST = ["AWS", "AI", "Docker"]

# Set a category as something that is always there - categories grabs the highest count rather than if trending
CATEGORIES_OF_INTEREST = []

########## SES Email Configs - Make sure you change these ########

SOURCE_EMAIL = 'noreply@safron.io' 
TO_ADRESS = 'ilsilfverskiold@gmail.com'
AWS_REGION_NAME = 'eu-north-1'


