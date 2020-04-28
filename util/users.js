const users = [];

// Join user to session
function userJoin(id, username) {
    let user;
    if (users.length === 0) {
        user = {id, username, active: true, words: []};
    } else {
        user = {id, username, active: false, words: []};
    }

    users.push(user);

    return user;
}

// Get user from socket
function getUserFromID(id) {
    return users.find(user => user.id === id);
}

// Get room users
function getUsers() {
    return users;
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Which user is currently active
function getActiveUserIndex() {
    return users.findIndex(user => user.active === true);
}

// Advance user turn
function advanceActiveUser() {
    const currentActiveIndex = getActiveUserIndex();
    users[currentActiveIndex].active = false;

    if ((currentActiveIndex + 1) >= users.length) {
        users[0].active = true;
    } else {
        users[currentActiveIndex + 1].active = true;
    }
}

function removeWord(userIndex, wordIndex) {
    users[userIndex].words.splice(wordIndex, 1);
}

module.exports = {
    userJoin,
    getUserFromID,
    getUsers,
    userLeave,
    advanceActiveUser,
    removeWord
};
