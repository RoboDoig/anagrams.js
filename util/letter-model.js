// generate letter objects from list of letters
function generateLetterModel(letters) {
    let letterArray = [];
    letters.forEach(function (letter, index) {
        letterArray.push({
            letter: letter.toUpperCase(),
            index,
            revealed: false,
        })
    });

    return letterArray;
}

function revealLetter(letterModel, index) {
    letterModel[index].revealed = true;
    letterModel[index].available = true;
}

function getAvailableLetters(letterModel) {
    return letterModel.filter(letter => letter.revealed === true).map(letter => letter.letter);
}

function useLetters(letterModel, indices) {
    indices.forEach(index => {
        letterModel[index].letter = '';
    })
}

module.exports = {
    generateLetterModel,
    revealLetter,
    getAvailableLetters,
    useLetters
};