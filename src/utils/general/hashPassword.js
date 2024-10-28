const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    let hashResult = "";
    let lengthPassword = (typeof password == "string") ? password.length: null;

    hashResult = await bcrypt.hash(password, lengthPassword)
    return hashResult
}

module.exports = hashPassword