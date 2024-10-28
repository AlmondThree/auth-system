const Users = require("../../models/Users");
const hashPassword = require("../../utils/general/hashPassword");
const {validateReqPayload} = require("../../utils/general/validateReqPayload");
const serviceConfig = require("../../config/json/servicesConfig.json");

async function serviceRegister(req, res) {
  const reqBody = req.body;

  const statusReqBody = validateReqPayload(
    reqBody,
    serviceConfig.register_user["mandatory_parameter"]
  );

  if (statusReqBody) {
    const resultPassword = await hashPassword(reqBody["password"]);

    const usersImpl = new Users();
    usersImpl.createObject(
      reqBody["username"],
      resultPassword,
      reqBody["roles"],
      reqBody["first_name"],
      reqBody["last_name"],
      reqBody["email"],
      reqBody["employee_id"]
    );

    const insertUser = await usersImpl.insertUsers();

    req.body.password = "***";
    res.locals.status = (insertUser.status == true) ? 200 : 400;
    res.locals.payload = insertUser;
    
  } else {
    res.locals.status = 400;
    res.locals.payload = {
      status: false,
      message: "Invalid Request"
    };
  }
}

module.exports = {serviceRegister};
