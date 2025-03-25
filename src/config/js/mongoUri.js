const envVar = require('../../utils/general/getEnvironmentVariable')

const attribute = (user) => {
    let attributeObj = {
        "username": null,
        "password": null
    }
    
    if (user === 'traxify_master') {
        attributeObj.username = 'traxify_master'
        attributeObj.password = envVar.getValueDotENV("MONGO_PASS_MASTER")
    }

    return attributeObj
}

const connectDB = (user) => {
    const mongoHost = envVar.getValueDotENV("CLOUD_HOST")
    const mongoPort = envVar.getValueDotENV("MONGODB_PORT")

    const attributeMongo = attribute(user)

    let mongoUri = `mongodb://${attributeMongo["username"]}:${attributeMongo["password"]}@${mongoHost}:${mongoPort}/`

    return mongoUri
}

//connectDB("traxify_master")

module.exports = {
    connectDB
}