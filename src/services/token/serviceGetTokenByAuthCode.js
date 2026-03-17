const Token = require("../../models/Token");
const Services = require("../../models/Services");

const getTokenByAuthCode = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {
    const authCodeReq = req.body.code;

    const token = new Token()

    let resMongo = await token.getTokenByAuthCode(authCodeReq);

    if(resMongo.isSuccess && resMongo.data) {
      service.setResponseObj(
        200,
        {
          status: true,
          message: "ok",
          data: {
            access_token: resMongo.data.access_token,
            refresh_token: resMongo.data.refresh_token
          }
        },
        null,
        null
      )

      token.updateTokenStatus(authCodeReq);

    } else {
      service.setResponseObj(
        400,
        {
          status: false,
          message: "Invalid auth code!"
        },
        null,
        null
      )
    }
    
  } catch(error) {
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
      response.errorMessage
  );

};

module.exports = { getTokenByAuthCode };
