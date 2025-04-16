const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getListRoles = async (req, res) => {
  let reqBody = req.body;

  const usersObj = new Users();
  const serviceObj = new Services();

  serviceObj.createResponseObj();

  try {
    let data = await usersObj.getRolesList();

    if(data) {
        serviceObj.setResponseObj(200, {
            status: true,
            data: data.rows,
        },null, null)
    } else {
        serviceObj.setResponseObj(400, {
            status: false,
            data: data,
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
