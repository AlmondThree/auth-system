const { MongoClient } = require('mongodb');
const mongoUri = require("../../config/js/mongoUri");

const uri = mongoUri.connectDB("traxify_master");

var instance;

const connectMongo = async () => {
    function newConnection() {
        return new MongoClient(uri);
    }

    return {
        getInstance : function () {
            if (instance == null) {
                instance = new newConnection();

                instance.contructor = null;
            }
            return instance;
        }
    }
}

module.exports = { connectMongo }