# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url')
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url')

def get_request(endpoint, **kwargs):
    # HARDCODE the correct backend URL
    CORRECT_BACKEND_URL = "https://u31241596-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
    
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"
    
    # Ensure endpoint starts with slash
    if not endpoint.startswith("/"):
        endpoint = "/" + endpoint
    
    request_url = f"{CORRECT_BACKEND_URL.rstrip('/')}{endpoint}"
    if params:
        request_url = f"{request_url}?{params.rstrip('&')}"
    
    print(f"GET from {request_url}")
    
    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error in get_request: {e}")
        # Return empty array as fallback
        return []
# Add code for get requests to back end

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")
