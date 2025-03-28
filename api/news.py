import json
import os
import requests

def handler(request):
    # Get query parameters from the request URL
    query = request.args.get("query", "Spain")
    language = request.args.get("language", "es")
    try:
        limit = int(request.args.get("limit", 10))
    except ValueError:
        limit = 10

    # Use your NEWS_API_KEY from environment variables
    NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "your_api_key")
    url = (
        f"https://newsapi.org/v2/everything?q={query}"
        f"&language={language}&sortBy=relevancy&apiKey={NEWS_API_KEY}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data.get("status") != "ok":
            return {
                "statusCode": 500,
                "body": json.dumps({"error": data.get("message", "Unknown error")}),
            }
        articles = data.get("articles", [])[:limit]
        return {
            "statusCode": 200,
            "body": json.dumps(articles),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }
