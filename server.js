const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateLetterModel, revealLetter, getLetters, useLetters, createStartingLetterArray} = require('./util/letter-model');
const {userJoin, getUserFromID, getUsers, userLeave, advanceActiveUser, removeWord, setUserTurn} = require('./util/users');
const {wordValid, wordPossible} = require('./util/anagrams');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up the game
const startingLetters = createStartingLetterArray();

let letterModel = generateLetterModel(startingLetters);
let usedWords = [];

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
        console.log(socket.id);
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
        console.log('word-submit received');
        console.log(socket.id);
        console.log(word);
        // check that the word is valid and it wasn't used before
        console.log(wordValid(word));
        console.log(usedWords);
        console.log(usedWords.includes(word));
        if (wordValid(word) && !usedWords.includes(word)) {
            console.log('word valid');
            var allUsers = getUsers();
            var i;
            var result;
            for (i = 0; i < allUsers.length; i++) {
                var userWords = allUsers[i].words;
                result = wordPossible(word, getLetters(letterModel), userWords);
                if (result.wordPossible) {
                    // remove used letters
                    if (result.letterIndices.length > 0) {
                        useLetters(letterModel, result.letterIndices);
                    }

                    // remove used words
                    if (result.wordIndex > -1) {
                        removeWord(i, result.wordIndex);
                    }

                    // add to users words and set turn to this user
                    getUserFromID(socket.id).words.push(word);
                    setUserTurn(socket.id);
                    // add to server used words
                    usedWords.push(word);

                    // update the player client
                    io.emit('update-players', getUsers());
                    io.emit('update-letters', letterModel);

                    // break from loop
                    break;
                }
            }
        }
    });

    // Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        io.emit('update-players', getUsers());

        // if no users left, reset game
        if (getUsers().length <= 0) {
            letterModel = generateLetterModel(startingLetters);
            usedWords = [];
        }
    })
});


// Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));