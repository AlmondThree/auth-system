const Services = require("../../models/Services");
const jwt = require("jsonwebtoken");

const { getDataById } = require("../../utils/mongodb/getDataDocs");

const sericeAuthorizeToken = async (req, res) => {
  let reqBody = req.body;

  const serviceObj = new Services();

  let statusRequest = serviceObj.validateRequest(reqBody, "authorize_token");

  serviceObj.createResponseObj();

  if (statusRequest) {
    try {
      let statusCode = 500;
      let errorMessage = null;
      let tokenDecode = jwt.decode(reqBody.token);

      let responsePayload;
      let isSuccess;

      jwt.verify(
        reqBody.token,
        `!${tokenDecode.username}+${tokenDecode.employee_id}&`,
        function (err) {
          if (err) {
            statusCode = 401;

            isSuccess = false;

            responsePayload = {
              is_valid: false,
              session_id: tokenDecode.session_id,
              message: "Token Expired!",
            };
          } else {
            isSuccess = true;
          }
        }
      );

      if (isSuccess) {
        statusCode = 200;
        let dataActivityById;

        try {
           dataActivityById = await getDataById(
            "activity",
            reqBody.id_activity
          );
        } catch (error) {
          if (error.toString() == "BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
            statusCode = 400;
            errorMessage = error.toString();
            responsePayload = {
              message: "Error get data roles from database. Please input correct activity id!",
            };

            dataActivityById = false;
          }
        }

        if (dataActivityById) {
          const isAllRole = !dataActivityById
            ? false
            : dataActivityById[0]["authorize_role"].includes("all.role");
          if (isAllRole) {
            responsePayload = {
              is_valid: true,
              session_id: tokenDecode.session_id,
              username: tokenDecode.username,
              role: tokenDecode.roles,
              next_link: reqBody.next_link,
              message: "Authorize successful!",
            };
          } else {
            let authorizeRole = dataActivityById[0]["authorize_role"];

            let isAuthorize = false;

            for (let i in authorizeRole) {
              isAuthorize = tokenDecode.roles.includes(authorizeRole[i])
                ? true
                : false;
            }

            if (isAuthorize) {
              responsePayload = {
                is_valid: true,
                session_id: tokenDecode.session_id,
                username: tokenDecode.username,
                role: tokenDecode.roles,
                next_link: reqBody.next_link,
                message: "Authorize successful!",
              };
            } else {
              statusCode = 401;
              responsePayload = {
                is_valid: false,
                session_id: tokenDecode.session_id,
                username: tokenDecode.username,
                role: tokenDecode.roles,
                next_link: reqBody.next_link,
                message: "This user is not authorize!",
              };
            }
          }
        }
      }

      serviceObj.setResponseObj(statusCode, responsePayload, null, errorMessage);
    } catch (error) {
      let message = {
        message: "Internal Server Error",
      };
      serviceObj.setResponseObj(500, message, null, error);
    }
  } else {
    let errorPayload = {
      status: false,
      message: "missing request parameter!",
    };
    serviceObj.setResponseObj(400, errorPayload);
  }

  let response = serviceObj.getResponseObj();

  res.locals = serviceObj.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage
  );
};

module.exports = { sericeAuthorizeToken };
