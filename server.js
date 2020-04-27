const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateLetterModel, revealLetter, getAvailableLetters, useLetters} = require('./util/letter-model');
const {userJoin, getUserFromID, getUsers, userLeave, advanceActiveUser} = require('./util/users');
const {wordValid, wordPossible} = require('./util/anagrams');

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
            // if it is this user's turn, reveal a letter if available
            revealLetter(letterModel, index.index);

            // go to next player turn
            advanceActiveUser();

            // update the player client
            io.emit('update-players', getUsers());
            io.emit('update-letters', letterModel);
        }
    });

    // Run whe client submits word
    socket.on('word-submit', word => {
        // check that the word is valid
        if (wordValid(word)) {
            // check how it can be made from the available letters
            var result = wordPossible(word, getAvailableLetters(letterModel), []);
            if (result.wordPossible) {
                // add to users words
                getUserFromID(socket.id).words.push(word);

                // remove used letters
                useLetters(letterModel, result.letterIndices);

                // update the player client
                io.emit('update-players', getUsers());
                io.emit('update-letters', letterModel);
            }
        }
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