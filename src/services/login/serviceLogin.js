const Users = require("../../models/Users");
const serviceConfig = require("../../config/json/servicesConfig.json");
const {
  validateReqPayload,
} = require("../../utils/general/validateReqPayload");
const bcrypt = require("bcrypt");
const {createJWT, createRefreshToken} = require('../../utils/general/createJWT')

const loginUser = async (req, res) => {
  let reqBody = req.body;
  let statusRequest = false;
  let response = {
    status: "",
    message: "",
    token: "",
    refresh_token: "",
  };

  const statusReqBody = validateReqPayload(
    reqBody,
    serviceConfig.login_user["mandatory_parameter"]
  );

  if (statusReqBody) {
    let usernameReq = req.body.username;
    let passwordReq = req.body.password;
    const usersImpl = new Users();

    let dataUser = await usersImpl.getDataByUsername(usernameReq);

    if (dataUser.rowCount > 0) {
      let storedPassword = dataUser.data[0]["password"];

      statusRequest = await bcrypt.compare(passwordReq, storedPassword);

      if(statusRequest) {

        let roleData = await usersImpl.getRoleByUserId(dataUser.data[0]["user_id"]);

        let roles = [];

        for(i = 0 ; i < roleData.rowCount; i++) { roles[i] = roleData.data[i]["role_name"] }

        let dataToken = {
          user_id: dataUser.data[0]["user_id"],
          username: dataUser.data[0]["username"],
          first_name: dataUser.data[0]["first_name"],
          last_name: dataUser.data[0]["last_name"],
          employee_id: dataUser.data[0]["employee_id"],
          roles: roles,
        }

        const token = createJWT(dataToken);
        const refreshToken = createRefreshToken(dataToken);

        response.status = "success";
        response.message = "Login Successful!";
        response.token = token;
        response.refresh_token = refreshToken;
      } else {
        response.status = "error";
        response.message = "Invalid credentials!";
      }

      res.locals.userId = dataUser.data[0]["user_id"]
    } else {
      response.status = "error";
      response.message = "Data not found!";
    }

    req.body.password = "***";
    res.locals.status = statusRequest ? 200 : 401;
    res.locals.payload = response;
  } else {
    res.locals.status = 400;
    res.locals.payload = {
      status: "error",
      message: "missing request parameter!",
    };
  }
};

module.exports = { loginUser };
