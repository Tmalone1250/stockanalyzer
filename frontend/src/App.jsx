import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Paper, TextField, Button, Typography, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import StockChart from './components/StockChart';
import StockInfo from './components/StockInfo';
import ChatBox from './components/ChatBox';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStockData = async () => {
    if (!stockSymbol) {
      setError('Please enter a stock symbol');
      return;
    }
    
    setLoading(true);
    setError('');
    setStockData(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${stockSymbol.toUpperCase()}`);
      const data = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Parse the Plotly chart data
      const chartData = JSON.parse(data.chart);
      setStockData({
        chart: chartData,
        info: data.info
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data. Please check the symbol and try again.');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData();
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Stock Analyzer
            </Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
              label="Dark Mode"
            />
          </Box>

          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Stock Symbol"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                variant="outlined"
                error={!!error}
                helperText={error}
              />
              <Button
                variant="contained"
                onClick={fetchStockData}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze'}
              </Button>
            </Box>
          </Paper>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {stockData && (
            <>
              <StockInfo data={stockData.info} />
              <StockChart data={stockData.chart} />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
