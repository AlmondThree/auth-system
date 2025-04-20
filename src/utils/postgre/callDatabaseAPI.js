const { poolConnection } = require('./poolConnection.js')

const callDatabase = async (paramQuery) => {

    try {

        const connectionInstance = (await poolConnection()).getInstance();

        const client = await connectionInstance.connect();

        const responseDB = await client.query(paramQuery)

        await client.release();
        
        return (
            {
                is_success: true,
                message: "query successful",
                rowCount: responseDB.rowCount,
                data: responseDB.rows,
            }
        )
    } catch (e) {
        return (
            {
                is_success: false,
                message: `Call Database: ${e.toString()}`,
            }
        )
    }
}

module.exports = { callDatabase }