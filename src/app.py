from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import yfinance as yf
import plotly.graph_objects as go
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='../templates', static_folder='../static')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    logger.info('Serving index page')
    return render_template('index.html')

def process_stock_data(symbol):
    """Helper function to process stock data"""
    logger.info(f'Processing stock data for {symbol}')
    
    if not symbol:
        return {'error': 'No symbol provided'}, 400
        
    try:
        # Get stock data
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1y')
        
        if hist.empty:
            return {'error': f'No data found for symbol: {symbol}'}, 404
        
        # Create candlestick chart
        fig = go.Figure(data=[go.Candlestick(x=hist.index,
                                            open=hist['Open'],
                                            high=hist['High'],
                                            low=hist['Low'],
                                            close=hist['Close'])])
        
        # Update layout
        fig.update_layout(title=f'{symbol} Stock Price',
                         yaxis_title='Price (USD)',
                         xaxis_title='Date')
        
        # Get company info
        info = stock.info
        company_info = {
            'name': info.get('longName', 'N/A'),
            'sector': info.get('sector', 'N/A'),
            'marketCap': info.get('marketCap', 'N/A'),
            'currentPrice': info.get('currentPrice', 'N/A')
        }
        
        return {
            'chart': fig.to_json(),
            'info': company_info
        }, 200
        
    except Exception as e:
        logger.error(f'Error processing {symbol}: {str(e)}')
        return {'error': str(e)}, 500

@app.route('/stock_data', methods=['POST'])
def get_stock_data():
    logger.info('Received POST request to /stock_data')
    logger.info(f'Request headers: {dict(request.headers)}')
    logger.info(f'Request data: {request.get_data(as_text=True)}')
    
    try:
        data = request.get_json()
        logger.info(f'Parsed JSON data: {data}')
        symbol = data.get('symbol', '').upper() if data else ''
        result, status_code = process_stock_data(symbol)
        return jsonify(result), status_code
    except Exception as e:
        logger.error(f'Error in /stock_data: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_legacy(symbol):
    """Handle the old API endpoint format"""
    logger.info(f'Received GET request to /api/stock/{symbol}')
    result, status_code = process_stock_data(symbol.upper())
    return jsonify(result), status_code

@app.route('/debug')
def debug_info():
    """Debug endpoint to check server status"""
    return jsonify({
        'status': 'running',
        'routes': [str(rule) for rule in app.url_map.iter_rules()],
        'static_folder': app.static_folder,
        'template_folder': app.template_folder
    })

if __name__ == '__main__':
    app.run(debug=True)
