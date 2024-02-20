import time
import boto3
import re
import os
try:
  from urllib2 import urlopen
except ImportError:
  from urllib.request import urlopen

def success(event, context):
    with context.serverless_sdk.span('create sts client'):
        sts = boto3.client('sts')
    sts.get_caller_identity()
    urlopen('https://httpbin.org/get').read()
    return 'success'

def error(event, context):
    raise Exception('error')

def http_error(event, context):
    try:
        from botocore.vendored import requests
        requests.get("https://asdfkasdjsdf")
    except:
        pass
    return 'http_erroO'

def event_tags(event, context):
    context.serverless_sdk.tag_event('event-tagged', 'true', { 'customerId': 5, 'userName': 'aaron.stuyvenberg'})
    return 'success'

def set_endpoint(event, context):
    context.serverless_sdk.set_endpoint('/test/:param', 'PATCH', '202')
    return 'success'

def timeout(event, context):
    time.sleep(10)

def get_transaction_id(event, context):
    transaction_id = context.serverless_sdk.get_transaction_id()
    if re.match(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", transaction_id):
        return "success"
    raise Exception("transactionId not set/uuid: {}".format(transaction_id))

def get_dashboard_url(event, context):
    url = context.serverless_sdk.get_dashboard_url()
    domain = "serverless" if os.getenv("PLATFORM_STAGE", "dev") == "prod" else "serverless-dev"
    exp = "/".join([
      "https://app.{}.com".format(domain),
      os.getenv("ORG"),
      "apps",
      os.getenv("APP"),
      os.getenv("SERVICE"),
      os.getenv("STAGE"),
      os.getenv("REGION"),
      "explorer",
      "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    ])
    if re.match(exp, url):
        return "success"
    raise Exception("dashboard url incorrect: {}".format(url))
