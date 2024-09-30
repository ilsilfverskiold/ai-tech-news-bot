# AI Tech News Crawler and Newsletter Bot

**Updated 30th of September 2024 - uses an updated endpoint**

This project is a serverless AI tech news crawler that uses AWS Lambda and EventBridge via the Serverless Framework to summarize keyword and category data based on a [trending keywords API](https://docs.safron.io/) built with natural language processing. 

The end result is a newsletter/report built on getting search data for tech sites for specific keywords that are trending within various categories specified by you. You can track keywords or you can track trending keywords within certain categories, and then use an LLM to summarize what is happening with these keywords themselves.

See the config.py file for setting specific categories or keywords. See the example newsletter that has been generated here.

The project is free to use and will only cost you the OpenAI tokens, about $0.05 per report. You may change the OpenAI LLM model.

If you need guidence or want to build the API yourself see this tutorial [here](https://levelup.gitconnected.com/build-a-personal-ai-tech-news-agent-94e7a2e508fe) and [here](https://medium.com/gitconnected/predicting-tech-trends-with-natural-language-processing-9d9ce1c082d3).

## Prerequisites

- AWS account
- OpenAI API key
- Python 3.8 or newer
- Serverless Framework
- Docker installed and running (optional)

## Getting Started

### 1. Set up your local environment

Start by creating a file locally where you'll store the code. 

```bash
mkdir tech-bot
cd tech-bot
```

Make sure you have python installed. 

```bash
python --version
```

If not, install it locally. Here it depends on which version you are on. If you are on 3.11 you don't need to do anything but if you are on a later or earlier version please change the runtime in the serverless.yml file.

Make sure you have the Serverless Framework installed if not nstall it globally using npm

```bash
npm install -g serverless
```

- You can check if Node.js and npm are installed by running node -v and npm -v in your terminal. If these commands return versions, Node.js and npm are already installed. If not, you'll need to install Node.js (npm comes bundled with Node.js).
- To install Node.js and npm, visit the Node.js website and download the installer for your operating system.

### 2. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/ilsilfverskiold/ai-tech-news-bot.git
cd ai-tech-news-bot
```

### 3. (Optional) Make sure Docker is running

Check that docker is running. If you do not want to package your dependencies with docker (which isn't really strictly necessary) then change the serverless.yml file like so.

```bash
custom:
  pythonRequirements:
    dockerizePip: false
```

At the moment it will be set to true.

### 4. Set up the environment

Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Install serverless-python-requirements like so.

```bash
serverless plugin install -n serverless-python-requirements
```


### 5. AWS Credentials Setup

Configure your AWS credentials for the Serverless Framework:

```bash
serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY
```

You'll get your credentials by creating an IAM user in the AWS console with something like these rights.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "events:DescribeRule",
                "apigateway:*",
                "s3:*",
                "logs:*",
                "events:PutRule",
                "events:RemoveTargets",
                "events:PutTargets",
                "events:DeleteRule",
                "iam:CreateRole",
                "cloudformation:*",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "events:PutTargets",
                "iam:PassRole",
                "lambda:*",
                "iam:TagRole",
                "iam:UntagRole"
            ],
            "Resource": "*"
        }
    ]
}
```

If you're having issues try to follow the tutorial here. 

### 6. Set Your OpenAI API Key

Export your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

You'll get an API key from OpenAI's platform directly. Make sure you have API credits available.

### 7. Configuration

Edit the config.py file to set up your preferences:

- Keywords and Categories: Specify your interests to tailor the news content.
- AWS SES Email Settings: Enter your "From" and "To" email addresses for the newsletter. Make sure you have the right to send and to recieve these emails from AWS SES.

Example config.py:

```python
CATEGORY_LIMITS = {
    "Subjects": 2,
    "Tools & Services": 6,
    "Websites & Applications": 2,
    "Concepts & Methods": 2,
    "Platforms & Search Engines": 6,
    "Companies & Organizations": 2,
    "Hardware & Systems": 2,
    "Languages & Syntax": 2,
    "Frameworks & Libraries": 2,
    "People": 2,
    "AI Models & Assistants": 6
} # keyword limits per category that is trending

KEYWORDS_OF_INTEREST = ["Docker", "AWS", "AI"] # will always be includes regardles if trending or not

CATEGORIES_OF_INTEREST = [["Platforms & Search Engines"]] # set the categories rather than keywords will get the top 2 results - change the code in the helper_functions if you want more keywords
```

Remember to keep it condensed or it may be too much information to digest (for yourself I mean). 

Also remember to set the correct email from and to adress that have been confirmed in AWS SES. Make sure you also set this up in AWS SES.

```python
SOURCE_EMAIL = 'noreply@safron.io' 
TO_ADRESS = 'ilsilfverskiold@gmail.com'
AWS_REGION_NAME = 'eu-north-1'
```

To go through a detailed tutorial go here.

### Optional: Customize Email Templates

Modify the templates.py file if you wish to change the bot's messaging style or how it processes and summarizes data.

### Optional: Tweak the scheduled events

Go to the serverless.yml file to tweak when the newsletters go out. The API usually gets new data before 10 AM UTC.

```yml
events:
    - eventBridge:
        schedule: 'cron(0 10 ? * 2-6 *)' # Trigger at 10 AM UTC on weekdays
        input:
            time_period: "daily"
    - eventBridge:
        schedule: 'cron(0 10 ? * FRI *)' # Trigger at 10 AM UTC every Friday
        input:
            time_period: "weekly"
```

## Deployment

You can test it locally before deploying. 

```bash
serverless invoke local --function newsletterTrigger
```

And when you're ready to go. You can deploy.

```bash
serverless deploy
```

## Usage

The bot uses data from these API endpoints.

Table endpoint that let's us get the trending keywords for a yesterday or the current week. 

```bash
curl -X GET \ 
"https://safron.io/api/table?period=daily&sort=trending"
```

Sources endpoint that will get us sources based on a keyword or ids.

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"keywords": ["Alexa", "Amazon"]}' \
"https://safron.io/api/sources?startDate=2024-01-30&endDate=2024-01-30"
```

This bot uses the sources from these to summarize based on our preferences and to build us customized tech news reports.
