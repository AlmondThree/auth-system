const { poolConnection } = require('./poolConnection.js')

const callDatabase = async (paramQuery) => {

    try {

        const connectionInstance = (await poolConnection()).getInstance();

        const client = await connectionInstance.connect();

        const response = await client.query(paramQuery)

        await client.release();
        
        return response
    } catch (e) {
        return (
            {
                status: "error",
                message: `Call Database: ${e.toString()}`,
            }
        )
    }
}

module.exports = { callDatabase }