const Services = require("../../models/Services");
const {
  getCredentialsTenant,
} = require("../../utils/mongodb/credentialsTenant");
const { decrypt } = require("../../utils/encryption/decrypt");

const getCredentialsTenantServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    let resMongo = await getCredentialsTenant(req.query["tenantId"]);

    if (resMongo && resMongo.length > 0) {
      const data = resMongo[0];

      const decryptedData = decrypt(data.encryptedData);

      const parsedData = JSON.parse(decryptedData);

      let responseData = {
        id: data._id,
        tenantId: data.tenantId,
        username: parsedData.username,
        password: parsedData.password,
        schema: parsedData.schema,
        isActive: data.isActive,
      };

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

module.exports = { getCredentialsTenantServices };
