const { ObjectId } = require("mongodb");
const { connectMongo } = require("./connectMongo");

const getDataDocs = async () => {
  const mongoObj = await connectMongo();

  const mongoClient = mongoObj.getInstance();

  let data = await mongoClient
    .db("db_data")
    .collection("activity")
    .find({})
    .toArray();

  return data;
};

const getDataById = async (collection, id) => {
  let data;
  if (collection && id) {
    const mongoObj = await connectMongo();

    const mongoClient = mongoObj.getInstance();

    let mongoId = new ObjectId(id);

    data = await mongoClient
      .db("db_data")
      .collection(collection)
      .find({ _id: mongoId })
      .toArray();
  }

  return data;
};

module.exports = { getDataDocs, getDataById };
