const Services = require("../../models/Services");
const Users = require("../../models/Users");
const jwt = require("jsonwebtoken");

const { createJWT } = require("../../utils/general/createJWT");

const serviceRefreshToken = async (req, res) => {
  let reqBody = req.body;

  const serviceObj = new Services();

  const usersImpl = new Users();

  let statusRequest = serviceObj.validateRequest(reqBody, "refresh_token");

  serviceObj.createResponseObj();

  if (statusRequest) {
    try {
      let tokenDecode = jwt.decode(reqBody.token);

      let isSuccess = false;

      jwt.verify(reqBody.token, `${tokenDecode.user_id}&`, function (err) {
        if (err) {
          isSuccess = false;
        } else {
          isSuccess = true;
        }
      });

      if (isSuccess) {
        let dataUser = await usersImpl.getDataByUserId(reqBody.user_id);

        if (dataUser.rowCount > 0 && dataUser.status != "error") {
          if (statusRequest) {
            let roleData = await usersImpl.getRoleByUserId(
              dataUser.data[0]["user_id"]
            );

            let roles = [];

            for (i = 0; i < roleData.rowCount; i++) {
              roles[i] = roleData.rows[i]["role_name"];
            }

            let dataToken = {
              user_id: dataUser.data[0]["user_id"],
              username: dataUser.data[0]["username"],
              first_name: dataUser.data[0]["first_name"],
              last_name: dataUser.data[0]["last_name"],
              employee_id: dataUser.data[0]["employee_id"],
              roles: roles,
            };

            const token = createJWT(dataToken);

            serviceObj.setResponseObj(
              200,
              {
                status: "success",
                message: "Success refresh token!",
                access_token: token,
              },
              null,
              null
            );
          } else {
            serviceObj.setResponseObj(
              400,
              {
                status: "error",
                message: "Invalid credentials!",
              },
              null,
              null
            );
          }
        } else if (dataUser.status == "error") {
          serviceObj.setResponseObj(
            500,
            {
              status: "Internal Server Error",
            },
            null,
            dataUser.message
          );
        } else {
          serviceObj.setResponseObj(
            400,
            {
              status: "error",
              message: "Data not found!",
            },
            null,
            null
          );
        }
      } else {
        serviceObj.setResponseObj(
          401,
          {
            status: "error",
            message: "Invalid refresh token!",
          },
          null,
          null
        );
      }
    } catch (error) {
      let errorPayload = {
        message: "Internal Server Error",
      };
      serviceObj.setResponseObj(500, errorPayload, null, error.toString());
    }
  } else {
    let errorPayload = {
      status: false,
      message: "missing request parameter!",
    };
    serviceObj.setResponseObj(400, errorPayload, null, errorPayload.message);
  }

  let response = serviceObj.getResponseObj();

  res.locals = serviceObj.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage
  );
};

module.exports = { serviceRefreshToken };
