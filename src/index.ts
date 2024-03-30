// Server side - Express app
import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    console.log('Received message from client:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
