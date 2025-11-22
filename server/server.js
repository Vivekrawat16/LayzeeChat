require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev, restrict in prod
    methods: ["GET", "POST"]
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/layzeechat')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Socket Setup
socketHandler(io);

// Routes
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('LayzeeChat API is running...');
  });
}


// Serve static assets in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
