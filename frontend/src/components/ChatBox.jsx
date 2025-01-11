import { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const ChatBox = ({ stockData }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        stockContext: stockData
      });

      setMessages(prev => [...prev, { text: response.data.response, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'ai'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        AI Assistant
      </Typography>
      
      <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ 
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <Paper 
              elevation={1}
              sx={{
                p: 1,
                maxWidth: '80%',
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                color: msg.sender === 'user' ? 'white' : 'text.primary'
              }}
            >
              <ListItemText primary={msg.text} />
            </Paper>
          </ListItem>
        ))}
      </List>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about the stock..."
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBox;
