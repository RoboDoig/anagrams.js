// HTML elements
const letterArea = document.querySelector('.letter-area');
const playerArea = document.querySelector('.player-info-container');
const wordInput = document.querySelector('.word-input');
const submitButton = document.querySelector('.word-submit');
submitButton.addEventListener("click", wordSubmit);

// Get username and room from URL
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Create socket
const socket = io();

// Join server
socket.emit('join', username);

// When server updates letters
socket.on('update-letters', letterModel => {
    updateLetterDisplay(letterModel)
});

// When new player joins
socket.on('update-players', users => {
    updatePlayerDisplay(users)
});

function updateLetterDisplay(letterModel) {
    clearLetterDisplay();
    letterModel.forEach(function (letter, index) {
        let div = document.createElement('div');
        div.classList.add('letter');

        if (letter.revealed) {
            div.innerHTML = `<h1>${letter.letter}</h1>`;
        } else {
            div.innerHTML = `<h1></h1>`;
        }

        letterArea.appendChild(div);
        div.addEventListener('click', (e) => {
            revealRequest(index);
        });
    })
}

function updatePlayerDisplay(users) {
    clearPlayerDisplay();
    users.forEach(function (user, index) {
        let div = document.createElement('div');
        if (user.active) {
            div.classList.add('player-info-active');
        } else {
            div.classList.add('player-info');
        }

        div.innerHTML = `<h2>${user.username}</h2><h3>Word</h3><h3>Word</h3>`;
        playerArea.appendChild(div);
    });
}

// clear letter area
function clearLetterDisplay() {
    letterArea.innerHTML = '';
}

// clear player display
function clearPlayerDisplay() {
    playerArea.innerHTML = '';
}

// send reveal request
function revealRequest(index) {
    socket.emit('reveal', {index});
}

// submit word
function wordSubmit() {
    // send word to server to check
    socket.emit('word-submit', wordInput.value);

    // clear input
    wordInput.value = '';
}

// // Letter parameters
// const startingLetters = ['a', 'b', 'c', 'd', 'e', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
//
// // Create letter model
// let letterModel = generateLetterModel(startingLetters);
//
// // Show letter model
// updateLetterDisplay();
//
// // data model
// // generate letter objects from list of letters
// function generateLetterModel(letters) {
//     let letterArray = [];
//     letters.forEach(function (letter, index) {
//         letterArray.push({
//             letter,
//             index,
//             revealed: false,
//             used: false
//         })
//     });
//
//     return letterArray;
// }
//
// function revealLetter(index) {
//     letterModel[index].revealed = true;
//     updateLetterDisplay();
// }
//
// // display / control
//
// // clear letter area
// function clearLetterDisplay() {
//     letterArea.innerHTML = '';
// }
//
// // display letter model in grid
// function updateLetterDisplay() {
//     clearLetterDisplay();
//     letterModel.forEach(function(letter, index) {
//         let div = document.createElement('div');
//         div.classList.add('letter');
//
//         if (letter.revealed) {
//             div.innerHTML = `<h1>${letter.letter}</h1>`;
//         } else {
//             div.innerHTML = `<h1></h1>`;
//         }
//
//         //div.innerHTML = `<h1></h1>`;
//         letterArea.appendChild(div);
//         div.addEventListener('click', (e) => {
//             revealLetter(index);
//         });
//     })
// }