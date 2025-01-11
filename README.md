# Stock Analyzer

A modern web-based stock analysis tool that provides real-time financial data, interactive charts, and AI-powered insights.

## Features

- Real-time stock data from Yahoo Finance
- Interactive price history charts
- Key financial metrics display
- Dark mode support
- CSV data export
- AI-powered chat assistant for stock analysis

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- OpenAI API key

## Setup

1. Clone the repository
2. Set up the backend:
   ```bash
   cd stock-analyzer
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd stock-analyzer
   python src/app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a stock symbol (e.g., AAPL, GOOGL) in the search box
2. Click "Analyze" to fetch the stock data
3. View the financial metrics and price history chart
4. Use the AI chat assistant to ask questions about the stock
5. Download the stock data as CSV if needed
6. Toggle dark mode for comfortable viewing

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Recharts
  - Axios

- Backend:
  - Flask
  - yfinance
  - OpenAI API
  - pandas
