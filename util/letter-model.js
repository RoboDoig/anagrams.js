// generate letter objects from list of letters
function generateLetterModel(letters) {
    let letterArray = [];
    letters.forEach(function (letter, index) {
        letterArray.push({
            letter: letter.toUpperCase(),
            index,
            revealed: false,
            used: false,
            available: true
        })
    });

    return letterArray;
}

function revealLetter(letterModel, index) {
    letterModel[index].revealed = true;
    letterModel[index].available = true;
}

function getAvailableLetters(letterModel) {
    return letterModel.filter(letter => letter.available === true && letter.revealed === true);
}

module.exports = {
    generateLetterModel,
    revealLetter,
    getAvailableLetters
};