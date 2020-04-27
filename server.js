const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const generateLetterModel = require('./util/letter-model');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up the game
const startingLetters = ['a', 'b', 'c', 'd', 'e', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let letterModel = generateLetterModel(startingLetters);

// Run when client connects
io.on('connection', socket => {
    // Send letter info to user
    socket.emit('update-letters', letterModel);

    // Run when client requests letter reveal
    socket.on('reveal', index => {
        console.log(index.index);
    });

    // Run when client disconnects
    socket.on('disconnect', () => {
        console.log('client disconnected');
    })
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));