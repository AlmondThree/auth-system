const Users = require("../../models/Users");
const serviceConfig = require("../../config/json/servicesConfig.json");
const {
  validateReqPayload,
} = require("../../utils/general/validateReqPayload");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  let reqBody = req.body;
  let statusRequest = false;
  let response = {
    status: "",
    message: "",
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
      let storedPassword = dataUser.rows[0]["password"];

      statusRequest = await bcrypt.compare(passwordReq, storedPassword);

      if(statusRequest) {
        response.status = "success";
        response.message = "Login Successful!";
      } else {
        response.status = "error";
        response.message = "Invalid credentials!";
      }

      res.locals.userId = dataUser.rows[0]["user_id"]
    } else {
      response.status = "error";
      response.message = "Data not found!";
    }

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
