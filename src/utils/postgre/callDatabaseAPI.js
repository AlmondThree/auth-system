const { poolConnection } = require('./poolConnection.js')

const callDatabase = async (paramQuery) => {

    const connectionInstance = (await poolConnection()).getInstance();

    const client = await connectionInstance.connect();

    try {

        const responseDB = await client.query(paramQuery)
        
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
    } finally {
        await client.release();
    }
}

module.exports = { callDatabase }