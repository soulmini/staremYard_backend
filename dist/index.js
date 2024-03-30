"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server side - Express app
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const port = 3000;
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
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
