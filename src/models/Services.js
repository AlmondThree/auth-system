const serviceConfig = require("../config/json/servicesConfig.json");
const {
  validateReqPayload,
} = require("../utils/general/validateReqPayload");

class Services {
  validateRequest(payload, service) {
    const isValid = validateReqPayload(
      payload,
      serviceConfig[service]["mandatory_parameter"]
    );
    return isValid;
  }

  createResponseObj() {
    this.response = {
        statusCode: 500,
        payload: {},
        headers: null,
    }
  }

  setResponseObj(paramStatusCode, paramPayload, paramHeaders, paramErrorMessage) {
    this.response = {
        statusCode: paramStatusCode,
        payload: paramPayload,
        headers: paramHeaders,
        errorMessage: paramErrorMessage,
    }
  }

  getResponseObj() {
    return this.response;
  }

  createNextAttribute(paramStatus, paramPayload, paramHeaders, paramErrorMessage) {
    let locals = {
      status: paramStatus,
      payload: paramPayload,
      headers: paramHeaders,
      errorMessage: paramErrorMessage,
    };

    return locals;
  }
}

module.exports = Services;
