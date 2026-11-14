const Users = require("../../models/Users");
const Services = require("../../models/Services");

const addScope = async (req, res) => {
  const usersObj = new Users();
  const serviceObj = new Services();

  serviceObj.createResponseObj();

  try {
    const dataBody = {
      scopeName: req.body.scopeName,
      description: req.body.description,
      isGeneral: req.body.isGeneral,
      servicesId: req.body.servicesId,
      isActive: req.body.isActive,
      userAction: req.body.userAction,
    }
    let data = await usersObj.addScope(dataBody.scopeName, dataBody.description, dataBody.isGeneral, dataBody.servicesId, dataBody.isActive, dataBody.userAction);

    if(data.status) {
        serviceObj.setResponseObj(201, {
            status: true,
            message: "Success add scopes!",
        },null, null)
    } else {
        serviceObj.setResponseObj(500, {
            message: "Internal Server Error"
        },null, data)
    }

  } catch (e) {
    let errorPayload = {
      status: false,
      message: e.toString(),
    };
    serviceObj.setResponseObj(500, errorPayload, null, e.toString());
  }

  let response = serviceObj.getResponseObj();

  res.locals = serviceObj.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage
  );
};

module.exports = { addScope };
