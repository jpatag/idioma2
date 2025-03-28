import json
import os
from newspaper import Article
import openai

def handler(request):
    try:
        body = json.loads(request.get_data())
    except Exception:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON"}),
        }

    article_url = body.get("url")
    target_language = body.get("target_language", "Spanish")
    level = body.get("level", "simple")
    if not article_url:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing article URL"}),
        }

    # Extract full text using newspaper3k
    try:
        article = Article(article_url)
        article.download()
        article.parse()
        full_text = article.text
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Error extracting article text: {e}"}),
        }

    # Use OpenAI to simplify the article text
    openai_api_key = os.environ.get("OPENAI_API_KEY", "your_api_key")
    openai.api_key = openai_api_key
    prompt = (
        f"Simplify the following news article into {level} {target_language} suitable for language learners. "
        "Maintain key details like names, dates, and locations, but use simpler vocabulary and shorter sentences.\n\n"
        f"{full_text}"
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # or your model of choice
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
        )
        simplified_text = response.choices[0].message.content.strip()
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Error simplifying article: {e}"}),
        }

    return {
        "statusCode": 200,
        "body": json.dumps({"simplified_text": simplified_text}),
    }
