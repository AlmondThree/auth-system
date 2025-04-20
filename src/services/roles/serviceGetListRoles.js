const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getListRoles = async (req, res) => {
  const usersObj = new Users();
  const serviceObj = new Services();

  serviceObj.createResponseObj();

  try {
    let data = await usersObj.getRolesList();

    if(data.status) {
        serviceObj.setResponseObj(200, {
            status: true,
            data: data.data,
        },null, null)
    } else {
        serviceObj.setResponseObj(400, {
            message: "Internal Server Error"
        },null, data)
    }

  } catch (e) {
    let errorPayload = {
      status: false,
      message: e.toString(),
    };
    serviceObj.setResponseObj(400, errorPayload, null, e.toString());
  }

  let response = serviceObj.getResponseObj();

  res.locals = serviceObj.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage
  );
};

module.exports = { getListRoles };
