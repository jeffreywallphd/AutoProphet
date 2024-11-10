import pandas as pd
import requests
from dotenv import load_dotenv
import os

def get_company_ticker(query, csv_file="World-Stock-Prices-Dataset.csv"):

  stock_data = pd.read_csv(csv_file)
  words = query.lower().split()
  for word in words:
    if word in stock_data["Brand_Name"].tolist():
      return stock_data[stock_data["Brand_Name"] == word]["Ticker"].values[0]

  return None

# user_query='What ws the price of apple yesterday?'
# print(get_company_ticker(user_query))