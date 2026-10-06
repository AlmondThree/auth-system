const Services = require("../../models/Services");
const Credentials = require("../../models/Credentials");
const { pushCredentials } = require("../../utils/mongodb/credentials");
const { encrypt } = require("../../utils/encryption/encrypt");

const pushCredentialsServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    const DataCredentilas = new Credentials(
      req.body.hostname,
      req.body.port,
      req.body.username,
      req.body.password,
    );

    const dataString = JSON.stringify(DataCredentilas);

    const encryptedData = encrypt(dataString);

    const data = {
      dbType: req.body.dbType,
      dbName: req.body.dbName,
      encryptedData: encryptedData,
      isSupabase: req.body.isSupabase,
      isActive: true,
    }

    let resMongo = await pushCredentials(data);

    if (resMongo.acknowledged) {
      service.setResponseObj(
        201,
        {
          status: true,
          message: "Success insert data",
          id: resMongo.insertedId,
        },
        null,
        null,
      );

    } else {
      service.setResponseObj(
        400,
        {
          status: false,
          message: "Invalid payload!",
        },
        null,
        resMongo.errorMessage,
      );
    }
  } catch (error) {
    let errorPayload = {
      status: false,
      message: "Internal server error",
    };
    service.setResponseObj(500, errorPayload, null, error.toString());
  }

  req.body.password = "***";

  let response = service.getResponseObj();

  res.locals = service.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage,
  );
};

module.exports = { pushCredentialsServices };
