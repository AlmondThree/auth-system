const { ObjectId } = require("mongodb");
const { connectMongo } = require("./connectMongo");

const getListCredentials = async (appName, dbId, dbType, dbName, isActive) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let filter = {};

  if (dbId) {
    filter._id = new ObjectId(dbId);
  }

  if(appName) {
    filter.appName = appName;
  }

  if (dbType) {
    filter.dbType = dbType;
  }

  if (dbName) {
    filter.dbName = dbName;
  }

  if (isActive !== undefined && isActive !== null) {
    filter.isActive = ( isActive === "true" || isActive === true ) ? true : false;
  } 

  let data = await mongoClient
    .db("db_credentials")
    .collection("credentials")
    .find(filter)
    .toArray();

  return data;
};

const getCredentials = async (dbId) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_credentials")
    .collection("credentials")
    .find({ _id: new ObjectId(dbId) })
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
    .updateOne({ _id: dbId }, credentials);

  return data;
};

module.exports = { getListCredentials, getCredentials, pushCredentials, updateCredentials };
