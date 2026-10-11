const Services = require("../../models/Services");
const {
  getListTenantCredentials,
} = require("../../utils/mongodb/credentialsTenant");
const { decrypt } = require("../../utils/encryption/decrypt");

const getListCredentialsTenantServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    let resMongo = await getListTenantCredentials(
      req.query["tenantId"],
      req.query["isActive"],
    );

    if (resMongo && resMongo.length > 0) {
      let responseData = [];

      for (let i = 0; i < resMongo.length; i++) {
        const data = resMongo[i];
        const decryptedData = decrypt(data.encryptedData);
        const parsedData = JSON.parse(decryptedData);

        responseData.push({
          id: data._id,
          tenantId: data.tenantId,
          username: parsedData.username,
          password: parsedData.password,
          schema: parsedData.schema,
          isActive: data.isActive,
        });
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
    } else {
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

module.exports = { getListCredentialsTenantServices };
