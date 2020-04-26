const letterArea = document.querySelector('.letter-area');
const startingLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

console.log(startingLetters);

populateLetters(startingLetters);

function populateLetters(letters) {
    letters.forEach(letter => {
        let div = document.createElement('div');
        div.classList.add('letter');
        div.innerHTML = `<h1>${letter}</h1>`;
        letterArea.appendChild(div);
    })
}