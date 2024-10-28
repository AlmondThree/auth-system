const envVar = require('../../utils/general/getEnvironmentVariable')
const configJson = require('../json/logsConfig.json')

const logsConfig = (typeLogs) => {
    const logHost = envVar.getValueDotENV("LOG_HOST")
    const logAPIKey = envVar.getValueDotENV("LOG_API_KEY")

    const endpoint = configJson[typeLogs]["endpoint"]

    let attribute = {
        url: `${logHost}/api/logs/v1/${endpoint}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': logAPIKey
            },
            body: {}
        }
    }

    return attribute
}

module.exports = {logsConfig}