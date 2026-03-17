const crypto = require('crypto')

function generateRandomCode(length) {
    return crypto.randomBytes(length)?.toString('hex');
}

module.exports = { generateRandomCode }