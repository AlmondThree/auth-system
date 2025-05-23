const envVar = require("../utils/general/getEnvironmentVariable");

const authenticationAPIKey = (req, res, next) => {
  let authHeader = req.header("x-api-key");

  if (authHeader == envVar.getValueDotENV("API_KEY")) {
    //res.time.reqTimeStart = new Date();
    res.time = {
      reqTime: new Date()
    };
    next();
  } else {
    res.status(401);
    res.send({ message: "Unauthorize access" });
  }
};

module.exports = { authenticationAPIKey };
