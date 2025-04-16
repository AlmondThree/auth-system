const { poolConnection } = require('./poolConnection.js')

const callDatabase = async (paramQuery) => {

    try {

        const connectionInstance = (await poolConnection()).getInstance();

        const client = await connectionInstance.connect();

        const response = await client.query(paramQuery)
        
        return response
    } catch (e) {
        return console.log(e.stack);
    }
}

module.exports = { callDatabase }