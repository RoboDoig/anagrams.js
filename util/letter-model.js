// generate letter objects from list of letters
function generateLetterModel(letters) {
    let letterArray = [];
    letters.forEach(function (letter, index) {
        letterArray.push({
            letter,
            index,
            revealed: false,
            used: false
        })
    });

    return letterArray;
}

module.exports = generateLetterModel;