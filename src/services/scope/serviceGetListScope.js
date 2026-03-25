const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getListScope = async (req, res) => {
  const usersObj = new Users();
  const serviceObj = new Services();

  serviceObj.createResponseObj();

  try {
    const query = req.query.q;
    const page = req.query.page;
    const size = req.query.size
    let data = await usersObj.getScopeList(query, page, size);

    if(data.status) {
        serviceObj.setResponseObj(200, {
            status: true,
            pages: data.pages,
            data: data.data,
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

module.exports = { getListScope };
