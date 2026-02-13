import os
import random
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class SearchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "symbol": self.symbol,
            "price": self.price,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }

@app.route('/api/stock/<ticker>', methods=['GET'])
def get_stock_price(ticker):
    ticker = ticker.upper()

    # --- REAL API MODE ---
    api_key = os.getenv("ALPHA_VANTAGE_KEY")
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={ticker}&apikey={api_key}'

    try:
        response = requests.get(url)
        data = response.json()

        # Check if the API returned an error or empty data
        if "Global Quote" not in data or not data["Global Quote"]:
            return jsonify({'error': 'Stock not found'}), 404

        quote = data["Global Quote"]
        price = float(quote['05. price'])
        change_percent = quote['10. change percent']

        # --- NEW: SAVE TO DATABASE ---
        # We create a new row in our table
        new_search = SearchHistory(symbol=ticker, price=price)
        
        # We add it to the "staging area"
        db.session.add(new_search)
        
        # We "commit" (save) the changes permanently
        db.session.commit()
        # -----------------------------

        return jsonify({
            'symbol': ticker,
            'price': price,
            'change_percent': change_percent,
            'history': [] # Real API doesn't give history on this endpoint yet
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    recent_searches = SearchHistory.query.order_by(SearchHistory.timestamp.desc()).limit(10).all()
    
    return jsonify([search.to_dict() for search in recent_searches])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)