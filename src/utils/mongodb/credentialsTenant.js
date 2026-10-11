const { ObjectId } = require("mongodb");
const { connectMongo } = require("./connectMongo");

const getListTenantCredentials = async (tenantId, isActive) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let filter = {};

  if (tenantId) {
    filter.tenantId = tenantId;
  }

  if (isActive !== undefined && isActive !== null) {
    filter.isActive = ( isActive === "true" || isActive === true ) ? true : false;
  } 

  let data = await mongoClient
    .db("db_credentials")
    .collection("tenantCredentials")
    .find(filter)
    .toArray();

  return data;
};

const getCredentialsTenant = async (tenantId) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_credentials")
    .collection("tenantCredentials")
    .find({ tenantId: tenantId })
    .toArray();

  return data;
};

const pushCredentialsTenant = async (credentials) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let mongoId = new ObjectId();

  let data = await mongoClient
    .db("db_credentials")
    .collection("tenantCredentials")
    .insertOne({ _id: mongoId, ...credentials });

  return data;
};

const updateCredentialsTenant = async (tenantId, credentials) => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_credentials")
    .collection("tenantCredentials")
    .updateOne({ tenantId: tenantId }, credentials);

  return data;
};

module.exports = { getListTenantCredentials, getCredentialsTenant, pushCredentialsTenant, updateCredentialsTenant };
