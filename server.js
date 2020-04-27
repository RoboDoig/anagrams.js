const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateLetterModel, revealLetter, getAvailableLetters} = require('./util/letter-model');
const {userJoin, getUserFromID, getUsers, userLeave, advanceActiveUser} = require('./util/users');

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
    // Register user
    socket.on('join', username => {
        const user = userJoin(socket.id, username);
        io.emit('update-players', getUsers());
    });

    // Send letter info to user
    socket.emit('update-letters', letterModel);

    // Run when client requests letter reveal
    socket.on('reveal', index => {
        if (getUserFromID(socket.id).active && letterModel[index.index].revealed === false) {
            revealLetter(letterModel, index.index);
            advanceActiveUser();
            io.emit('update-players', getUsers());
            io.emit('update-letters', letterModel);
            console.log(getAvailableLetters(letterModel));
        }
    });

    // Run whe client submits word
    socket.on('word-submit', word => {
        getUserFromID(socket.id).words.push(word);
        // check that the word is valid

        // check how it can be made from the available letters

        // update the player client
        io.emit('update-players', getUsers());
    });

    // Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        io.emit('update-players', getUsers());
    })
});


// Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));