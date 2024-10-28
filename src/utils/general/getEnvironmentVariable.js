require('dotenv').config()

function getValueDotENV(key) {
    
    const envVarObj = process.env
    let value = envVarObj[key]
    
    return value
}

module.exports = {
    getValueDotENV
}