const shuffle = require('shuffle-array');

// letter default params
const letterParams = [{letter: 'a', score: 2, freq: 7},
    {letter: 'b', score: 7, freq: 2},
    {letter: 'c', score: 6, freq: 3},
    {letter: 'd', score: 5, freq: 4},
    {letter: 'e', score: 1, freq: 10},
    {letter: 'f', score: 7, freq: 2},
    {letter: 'g', score: 6, freq: 3},
    {letter: 'h', score: 6, freq: 3},
    {letter: 'i', score: 2, freq: 4},
    {letter: 'j', score: 8, freq: 2},
    {letter: 'k', score: 7, freq: 2},
    {letter: 'l', score: 5, freq: 4},
    {letter: 'm', score: 6, freq: 4},
    {letter: 'n', score: 4, freq: 5},
    {letter: 'o', score: 2, freq: 5},
    {letter: 'p', score: 6, freq: 6},
    {letter: 'q', score: 8, freq: 2},
    {letter: 'r', score: 2, freq: 5},
    {letter: 's', score: 3, freq: 4},
    {letter: 't', score: 3, freq: 4},
    {letter: 'u', score: 5, freq: 5},
    {letter: 'v', score: 7, freq: 2},
    {letter: 'w', score: 7, freq: 2},
    {letter: 'x', score: 8, freq: 1},
    {letter: 'y', score: 7, freq: 2},
    {letter: 'z', score: 8, freq: 1}];

function createStartingLetterArray() {
    var letterArray = [];
    letterParams.forEach(letter => {
        letterArray.push(letter.letter.repeat(letter.freq))
    });
    return shuffle(letterArray.join('').split(''));
}

// generate letter objects from list of letters
function generateLetterModel(letters) {
    let letterArray = [];
    letters.forEach(function (letter, index) {
        letterArray.push({
            letter: letter.toUpperCase(),
            index,
            revealed: false,
            used: false
        })
    });

    return letterArray;
}

function revealLetter(letterModel, index) {
    letterModel[index].revealed = true;
    letterModel[index].available = true;
}

function getLetters(letterModel) {
    return letterModel.map(letter => {
        if (letter.revealed) {
            return letter.letter;
        } else {
            return '';
        }
    });
}

// function getAvailableLetters(letterModel) {
//     return letterModel.filter(letter => letter.revealed === true).map(letter => letter.letter);
// }

function useLetters(letterModel, indices) {
    indices.forEach(index => {
        letterModel[index].letter = '';
        letterModel[index].used = true;
    })
}

module.exports = {
    generateLetterModel,
    revealLetter,
    getLetters,
    useLetters,
    createStartingLetterArray
};