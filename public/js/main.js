// HTML elements
const letterArea = document.querySelector('.letter-area');

// Get username and room from URL
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Create socket
const socket = io();

// Join server
socket.emit('joinRoom', {username});

// Message handling
socket.on('update-letters', letterModel => {
    console.log(letterModel);
    updateLetterDisplay(letterModel)
});

function updateLetterDisplay(letterModel) {
    clearLetterDisplay();
    letterModel.forEach(function(letter, index) {
        let div = document.createElement('div');
        div.classList.add('letter');

        if (letter.revealed) {
            div.innerHTML = `<h1>${letter.letter}</h1>`;
        } else {
            div.innerHTML = `<h1></h1>`;
        }

        //div.innerHTML = `<h1></h1>`;
        letterArea.appendChild(div);
        div.addEventListener('click', (e) => {
            revealRequest(index);
        });
    })
}

// clear letter area
function clearLetterDisplay() {
    letterArea.innerHTML = '';
}

// send reveal request
function revealRequest(index) {
    socket.emit('reveal', {index});
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