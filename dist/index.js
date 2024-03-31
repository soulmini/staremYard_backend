"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server side - Express app
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const child_process_1 = require("child_process");
const options_1 = require("./rtmpOptions/options");
const app = (0, express_1.default)();
const port = 3000;
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// @ts-ignore
const ffmpegProcess = (0, child_process_1.spawn)('ffmpeg', options_1.options);
// @ts-ignore
ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data}`);
});
// @ts-ignore
ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`);
});
// @ts-ignore
ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
});
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    // Assuming ffmpegProcess is properly initialized before this point
    ws.on('message', (data) => {
        if (data instanceof Buffer) {
            // Handle binary data as a Buffer object
            //console.log('Received binary data:', data);
            // Check if ffmpegProcess and its stdin stream are initialized and writable
            // @ts-ignore
            if (ffmpegProcess && ffmpegProcess.stdin && ffmpegProcess.stdin.writable) {
                // @ts-ignore
                ffmpegProcess.stdin.write(data, (err) => {
                    if (err) {
                        console.error('Error writing to ffmpegProcess.stdin:', err);
                    }
                    else {
                        console.log('Data written to ffmpegProcess.stdin successfully');
                    }
                });
            }
            else {
                console.error('ffmpegProcess or its stdin stream is not properly initialized');
            }
        }
        else if (typeof data === 'string') {
            // Handle text data
            console.log('Received text data:', data);
        }
        else {
            // Handle other data types
            console.log('Received data of unknown type:', data);
        }
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
