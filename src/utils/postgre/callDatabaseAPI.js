const { Pool } = require('pg')

const dbConfig = require('../../config/js/databaseConnection')

const callDatabase = async (paramQuery) => {

    try {
        const dbAttribute = dbConfig.dbConnection()

        const poolDb = new Pool(dbAttribute)

        const response = await poolDb.query(paramQuery)

        poolDb.end()
        
        return response
    } catch (e) {
        return e.stack;
    }
}

module.exports = { callDatabase }