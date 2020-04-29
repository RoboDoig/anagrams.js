const fs = require('fs');
const wordList = formatWords(readWords('./util/WordList.txt'));
//console.log(wordList[0]);
console.log(wordList.length);

function readWords(path) {
    return fs.readFileSync(path, 'utf8');
}

function formatWords(words) {
    return words.split('\r\n');
}

function wordValid(word) {
    return wordList.includes(word.toUpperCase());
}

// Check if word can be made, returns how word can be made and which letters or words to use
function wordPossible(word, availableLetters, availableWords) {
    // can word be made just from available letters?
    var charArray = word.toUpperCase().split('');
    var remainingLetters = Array.from(availableLetters);
    var matchedLetterIndices = [];
    var result = {};

    charArray.forEach(function (char, index) {
        var matchIndex = remainingLetters.findIndex(letter => letter === char);
        if (matchIndex >= 0) {
            remainingLetters[matchIndex] = '';
            matchedLetterIndices.push(matchIndex);
        }
    });

    if (matchedLetterIndices.length === charArray.length) {
        result = {
            wordPossible: true,
            method: 'available-letters',
            letterIndices: matchedLetterIndices,
            wordIndex: -1
        };

        return result;
    }

    // can word be made just by rearranging one of the available words?
    availableWords.forEach(function (availableWord, index) {
        if (charArray.sort().join('') === availableWord.split('').sort().join('')) {
            result = {
                wordPossible: true,
                method: 'direct-anagram',
                letterIndices: [],
                wordIndex: index
            }
        }
    });

    if (result.wordPossible) return result;

    // can word be made by a combination of available letters and one of the available words?
    // first, are all letters from available word present in the target word?
    availableWords.forEach(function (availableWord, index) {
        var availableWordCopy = Array.from(availableWord.split(''));
        var wordCopy = Array.from(charArray);

        charArray.forEach(function (char, c) {
            var matchIndex = availableWordCopy.findIndex(letter => letter === char)
            if (matchIndex >= 0) {
                availableWordCopy[matchIndex] = '';
                wordCopy[c] = '';
            }
        });

        // if so, what letters remain and are they in the remaining available letters?
        if (availableWordCopy.every(letter => letter === '')) {
            var finalLetters = wordCopy.filter(letter => letter !== '');
            var remainingLetters = Array.from(availableLetters);
            var matchedLetterIndices = [];
            finalLetters.forEach(function (char, index) {
                var matchIndex = remainingLetters.findIndex(letter => letter === char);
                if (matchIndex >= 0) {
                    remainingLetters[matchIndex] = '';
                    matchedLetterIndices.push(matchIndex);
                }
            });

            if (matchedLetterIndices.length === finalLetters.length) {
                result = {wordPossible: true,
                    method: 'combination',
                    letterIndices: matchedLetterIndices,
                    wordIndex: index
                }
            }
        }
    });

    return result;

    // default condition
    return {wordPossible: false, method: 'none', letterIndices: [], wordIndex: []}
}

module.exports = {wordValid, wordPossible};