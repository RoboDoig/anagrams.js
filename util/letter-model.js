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
    useLetters
};