async function getStockData() {
    const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const errorDiv = document.getElementById('error');
    const stockInfoDiv = document.getElementById('stockInfo');
    const loadingDiv = document.getElementById('loading');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const chartDiv = document.getElementById('chart');
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    // Reset UI state
    errorDiv.style.display = 'none';
    stockInfoDiv.style.display = 'none';
    chartDiv.innerHTML = '';
    
    // Show loading state
    loadingDiv.style.display = 'block';
    analyzeBtn.disabled = true;
    
    try {
        console.log('Fetching data for symbol:', symbol);
        const response = await fetch('/stock_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ symbol })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || `Failed to fetch stock data for ${symbol}`);
        }
        
        // Update company info
        document.getElementById('companyName').textContent = data.info.name;
        document.getElementById('sector').textContent = data.info.sector;
        document.getElementById('marketCap').textContent = formatMarketCap(data.info.marketCap);
        document.getElementById('currentPrice').textContent = formatPrice(data.info.currentPrice);
        
        // Show stock info section
        stockInfoDiv.style.display = 'block';

        // Display chart
        const chartData = JSON.parse(data.chart);
        Plotly.newPlot('chart', chartData.data, chartData.layout);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        // Hide loading state
        loadingDiv.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

function formatMarketCap(marketCap) {
    if (marketCap === 'N/A') return 'N/A';
    
    const billion = 1000000000;
    const million = 1000000;
    
    if (marketCap >= billion) {
        return `$${(marketCap / billion).toFixed(2)}B`;
    } else if (marketCap >= million) {
        return `$${(marketCap / million).toFixed(2)}M`;
    } else {
        return `$${marketCap.toLocaleString()}`;
    }
}

function formatPrice(price) {
    if (price === 'N/A') return 'N/A';
    return `$${Number(price).toFixed(2)}`;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const stockInfoDiv = document.getElementById('stockInfo');
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    stockInfoDiv.style.display = 'none';
    document.getElementById('chart').innerHTML = '';
}
