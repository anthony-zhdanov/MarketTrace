import os
import random
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
 
def generate_mock_data(): 
    mock_data = []
    base_price = 150.00

    for i in range(30):
        change = random.uniform(-5, 5)
        price = base_price + change
        mock_data.append({
            "date": f"2023-11-{i+1:02d}",
            "price": round(price, 2)
        })
        base_price = price

    return {
        "symbol": "TEST_MOCK",
        "price": round(base_price, 2),
        "change_percent": "0.42%",
        "history": mock_data
    }

@app.route('/api/stock/<symbol>', methods = ['GET'])
def get_stock_price(symbol):
    if symbol.upper() == "TEST":
        return jsonify(generate_mock_data())

    api_key = os.getenv('ALPHA_VANTAGE_KEY')
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
    
    response = requests.get(url)
    data = response.json()

    if "Global Quote" not in data:
        return jsonify({"error": "Invalid symbol or API limit reached"}), 400

    stock_data = {
        "symbol": data["Global Quote"]["01. symbol"],
        "price": float(data["Global Quote"]["05. price"]),
        "change_percent": data["Global Quote"]["10. change percent"],
        "history": []
    }

    return jsonify(stock_data)

if __name__ == '__main__':
    app.run(debug=True)