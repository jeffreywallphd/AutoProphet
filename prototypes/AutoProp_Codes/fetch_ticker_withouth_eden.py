import spacy
import requests
from dotenv import load_dotenv
import os
# Load the spaCy model for named entity recognition
nlp = spacy.load('en_core_web_sm')
load_dotenv()

# Access the API key
api_key = os.getenv('API_KEY')
# Function to extract company name from the user query
def extract_company_name(query):
    doc = nlp(query)
    for ent in doc.ents:
        if ent.label_ == "ORG":  # "ORG" identifies organizations like companies
            return ent.text
    return None

# Function to get the ticker symbol from the API using the extracted company name
def get_ticker_from_api(stock_name):
    url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={stock_name}&apikey={api_key}'
    response = requests.get(url).json()
    # print(response)
    if "bestMatches" in response and response["bestMatches"]:
        return response["bestMatches"][0]["1. symbol"]  # Returns the top result's ticker symbol
    else:
        return "Ticker not found"

# User query
user_query = "What was the price of Tesla yesterday?"

# Extract company name from the query
stock_name = extract_company_name(user_query)
if stock_name:
    ticker_symbol = get_ticker_from_api(stock_name)
    print(f"The ticker symbol for {stock_name} is: {ticker_symbol}")
else:
    print("No company name found in the query.")
# print(get_ticker_from_api(user_query))