const { ObjectId } = require("mongodb");
const { connectMongo } = require("./connectMongo");

const getCredentials = async (dbId) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_credentials")
    .collection("credentials")
    .find({ dbName: dbId })
    .toArray();

  return data;
};

const pushCredentials = async (credentials) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let mongoId = new ObjectId();

  let data = await mongoClient
    .db("db_credentials")
    .collection("credentials")
    .insertOne({ _id: mongoId, ...credentials });

  return data;
};

const updateCredentials = async (dbId, credentials) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_credentials")
    .collection("credentials")
    .updateOne({ dbName: dbId }, credentials);

  return data;
};

module.exports = { getCredentials, pushCredentials, updateCredentials };
