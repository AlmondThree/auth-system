const createSessionId = (length) => {
    let result = "";
    let character = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(i = 0 ; i < length; i++) {
        const randomId = Math.floor(Math.random() * character.length);
        result += character.charAt(randomId);
    }

    return result;

}

module.exports = { createSessionId }