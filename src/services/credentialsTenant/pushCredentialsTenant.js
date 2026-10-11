const Services = require("../../models/Services");
const CredentialsTenant = require("../../models/CredentialsTenant");
const { pushCredentialsTenant } = require("../../utils/mongodb/credentialsTenant");
const { encrypt } = require("../../utils/encryption/encrypt");

const pushCredentialsTenantServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    const DataCredentilas = new CredentialsTenant(
      req.body.username,
      req.body.password,
      req.body.schema
    );

    const dataString = JSON.stringify(DataCredentilas);

    const encryptedData = encrypt(dataString);

    const data = {
      tenantId: req.body.tenantId,
      encryptedData: encryptedData,
      isActive: true,
    }

    let resMongo = await pushCredentialsTenant(data);

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

module.exports = { pushCredentialsTenantServices };
