# Set your name
NAME = "Ida"

# Choose your OpenAI Model (Chat only) - GPT-3.5 is vastly cheaper than GPT-4
MODEL_NAME = "gpt-3.5-turbo-0125"

# Word count for keyword summaries (the longer the more detailed the summaries will be)
WORD_COUNT = '100'

# Define category limits for the trending keywords - it will grab by top count first (check safron.io to look over your options)
CATEGORY_LIMITS = {
    "Subjects": 2,
    "Tools & Services": 2,
    "Websites & Applications": 2,
    "Concepts & Methods": 2,
    "Platforms & Search Engines": 2,
    "Companies & Organizations": 2,
    "Hardware & Systems": 2,
    "Languages & Syntax": 2,
    "Frameworks & Libraries": 2,
    "People": 2,
    "AI Models & Assistants": 2
}

# Set your keywords of interest - should always be there regardless if they are trending yesterday or not
KEYWORDS_OF_INTEREST = ["AWS", "Docker"]

# Set a category as something that is always there - categories grabs the highest count rather than if trending
CATEGORIES_OF_INTEREST = []


########## SES Email Configs - Make sure you change these (!) ########

SOURCE_EMAIL = 'noreply@safron.io' 
TO_ADRESS = 'ilsilfverskiold@gmail.com'
AWS_REGION_NAME = 'eu-north-1'


