const authenticationAPIKey = (req, res, next) => {
  let authHeader = req.header("x-api-key");

  if (authHeader == "snwadb2o4n89jnsgqlzpk3pmb4pg") {
    res.locals.reqTimeStart = new Date();
    next();
  } else {
    res.status(401);
    res.send({ message: "Unauthorize access" });
  }
};

module.exports = { authenticationAPIKey };
