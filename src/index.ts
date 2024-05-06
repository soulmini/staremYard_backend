import express from 'express';
import http from 'http';
import cors from 'cors'
import { spawn } from 'child_process';
import { Server } from 'socket.io';
import login from './routes/auth/login';
import signup from './routes/auth/signup';


const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const options = [
  '-i',
  '-',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-r', '25',
  '-g', '50', // This should be multiplied by 2 for keyframe interval (GOP size)
  '-keyint_min', '25',
  '-crf', '25',
  '-pix_fmt', 'yuv420p',
  '-sc_threshold', '0',
  '-profile:v', 'main',
  '-level', '3.1',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', '32000', // Adjust the audio sample rate as needed
  '-f', 'flv',
  'rtmp://a.rtmp.youtube.com/live2/xh7w-g3da-s6ga-ehry-6egw',
];

const ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stdout.on('data', (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
  console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on('close', (code) => {
  console.log(`ffmpeg process exited with code ${code}`);
});

io.on('connection', (socket) => {
  console.log(`Client connected to Socket.IO`);

  socket.on('webcam', (data) => {
    if (ffmpegProcess && ffmpegProcess.stdin && ffmpegProcess.stdin.writable) {
      ffmpegProcess.stdin.write(data, (err) => {
        if (err) {
          console.error('Error writing to ffmpegProcess.stdin:', err);
        } else {
          console.log('Data written to ffmpegProcess.stdin successfully');
        }
      });
    } else {
      console.error('ffmpegProcess or its stdin stream is not properly initialized');
    }
  });

  socket.on('screen', (data) => {
    if (ffmpegProcess && ffmpegProcess.stdin && ffmpegProcess.stdin.writable) {
      ffmpegProcess.stdin.write(data, (err) => {
        if (err) {
          console.error('Error writing to ffmpegProcess.stdin:', err);
        } else {
          console.log('Data written to ffmpegProcess.stdin successfully');
        }
      });
    } else {
      console.error('ffmpegProcess or its stdin stream is not properly initialized');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.IO');
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
});

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

// auth
app.use('/auth', login);
app.use('/auth', signup);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
