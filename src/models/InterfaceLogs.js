const Logs = require("./Logs");

class Interface extends Logs {

  setObj(
    id_activity,
    timestamp,
    user_id,
    access_token,
    request_payload,
    response_payload,
    response_time,
    start_date,
    end_date
  ) {
    (this.id_activity = id_activity),
      (this.timestamp = timestamp),
      (this.user_id = user_id),
      (this.access_token = access_token),
      (this.request_payload = request_payload),
      (this.response_payload = response_payload),
      (this.response_time = response_time),
      (this.start_date = start_date),
      (this.end_date = end_date);
  }

  getObj() {
    const dateTimestamp = new Date();

    let object = {
      id_activity: this.id_activity,
      timestamp: null,
      user_id: this.user_id,
      access_token: this.access_token,
      request_payload: this.request_payload,
      response_payload: this.response_payload,
      response_time: this.response_time,
    };

    return object;
  }
}

module.exports = Interface;
