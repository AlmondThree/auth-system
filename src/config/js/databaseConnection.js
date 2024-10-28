const envVar = require("../../utils/general/getEnvironmentVariable");

const dbConnection = () => {
  const dbAttribute = {
    user: envVar.getValueDotENV("DB_USERNAME"),
    password: envVar.getValueDotENV("DB_PASSWORD"),
    host: envVar.getValueDotENV("DB_HOST"),
    port: envVar.getValueDotENV("DB_PORT"),
    database: envVar.getValueDotENV("DB_USERS_NAME"),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  return dbAttribute;
};

module.exports = {
  dbConnection,
};
