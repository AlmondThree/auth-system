const { Pool } = require('pg')

const dbConfig = require('../../config/js/databaseConnection')

var instance;

const poolConnection = async () => {
    function createPool() {
        const dbAttribute = dbConfig.dbConnection()
        
        const poolDb = new Pool(dbAttribute)

        return poolDb
    }

    return {
        getInstance : function () {
            if (instance == null) {
                instance = new createPool();

                instance.contructor = null;
            }
            return instance;
        }
    }
}

module.exports = { poolConnection }