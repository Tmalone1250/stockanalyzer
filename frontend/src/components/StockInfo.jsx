import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

const StockInfo = ({ data }) => {
  const formatMarketCap = (value) => {
    if (value === 'N/A' || !value) return 'N/A';
    const billion = 1000000000;
    const million = 1000000;
    
    if (value >= billion) {
      return `$${(value / billion).toFixed(2)}B`;
    } else if (value >= million) {
      return `$${(value / million).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPrice = (price) => {
    if (price === 'N/A' || !price) return 'N/A';
    return `$${Number(price).toFixed(2)}`;
  };

  const metrics = [
    { label: 'Company Name', value: data.name },
    { label: 'Sector', value: data.sector },
    { label: 'Market Cap', value: formatMarketCap(data.marketCap) },
    { label: 'Current Price', value: formatPrice(data.currentPrice) },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stock Information
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.label}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '50%' }}>
                  {metric.label}
                </TableCell>
                <TableCell align="right">
                  {metric.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StockInfo;
