const {logsConfig} = require("../config/js/logsConfig");

class Logs {
  setObj() {}

  getObj() {}

  async sendLogs(typeLogs) {
    let requestPayload = this.getObj();

    //Logic send logs
    let attributeLogs = logsConfig(typeLogs);

    attributeLogs.options["body"] = JSON.stringify(requestPayload);

    fetch(attributeLogs.url, attributeLogs.options)
      .then()
      .catch((error) => {console.log(error)});
  }
}

module.exports = Logs;
