import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ data }) => {
  if (!data || !data.data || !data.data[0]) {
    return null;
  }

  // Transform Plotly data to Recharts format
  const chartData = data.data[0].x.map((date, index) => ({
    date,
    open: data.data[0].open[index],
    high: data.data[0].high[index],
    low: data.data[0].low[index],
    close: data.data[0].close[index]
  }));

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Price History
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
            name="Closing Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StockChart;
