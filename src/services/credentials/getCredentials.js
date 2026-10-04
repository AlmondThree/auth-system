const Services = require("../../models/Services");
const { getCredentials } = require("../../utils/mongodb/credentials");
const { decrypt } = require("../../utils/encryption/decrypt");

const getCredentialsServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    let resMongo = await getCredentials(req.query["dbName"]);

    if (resMongo && resMongo.length > 0) {
      const data = resMongo[0];

      const decryptedData = decrypt(data.encryptedData);

      const parsedData = JSON.parse(decryptedData);

        let responseData = {};

      if(req.query["format"] == "jdbc" && req.query["isSupabase"] === "true") {
        responseData = {
            id: data._id,
            dbType: data.dbType,
            dbName: data.dbName,
            jdbcUrl: `jdbc:${data.dbType}://${parsedData.hostname}:${parsedData.port}/postgres?user=${parsedData.username}&password=${parsedData.password}&prepareThreshold=0`,
            username: parsedData.username,
            password: parsedData.password,
            isActive: data.isActive,
        }
      }else if (req.query["format"] == "jdbc"){
        responseData = {
            id: data._id,
            dbType: data.dbType,
            dbName: data.dbName,
            jdbcUrl: `jdbc:${data.dbType}://${parsedData.hostname}:${parsedData.port}/${data.dbName}?user=${parsedData.username}&password=${parsedData.password}&prepareThreshold=0`,
            username: parsedData.username,
            password: parsedData.password,
            isActive: data.isActive,
        }
      } else {
        responseData = {
            id: data._id,
            dbType: data.dbType,
            dbName: data.dbName,
            hostname: parsedData.hostname,
            port: parsedData.port,
            username: parsedData.username,
            password: parsedData.password,
            isActive: data.isActive,
          }
      }

      service.setResponseObj(
        200,
        {
          status: true,
          message: "ok",
          data: responseData,
        },
        null,
        null,
      );
    } else if (resMongo && resMongo.length == 0) {
      service.setResponseObj(
        200,
        {
          status: true,
          message: "Data not found!",
          data: null,
        },
        null,
        null,
      );
    }else {
      service.setResponseObj(
        400,
        {
          status: false,
          message: "Invalid param!",
        },
        null,
        null,
      );
    }
  } catch (error) {
    let errorPayload = {
      status: false,
      message: "Internal server error",
    };
    service.setResponseObj(500, errorPayload, null, error.toString());
  }

  let response = service.getResponseObj();

  res.locals = service.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage,
  );
};

module.exports = { getCredentialsServices };
