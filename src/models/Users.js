const { callDatabase } = require("../utils/postgre/callDatabaseAPI");

class Users {
  createObject(
    username,
    password,
    role,
    firstName,
    lastName,
    email,
    employeeId
  ) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.employeeId = employeeId;
  }

  getObject() {
    let data = {
      username: this.username,
      password: this.password,
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      employeeId: this.employeeId,
    };

    return data;
  }

  isValid() {
    let valid = false;

    if (
      this.email &&
      this.employeeId &&
      this.firstName &&
      this.lastName &&
      this.password &&
      this.role &&
      this.username
    ) {
      valid = true;
    }

    return valid;
  }

  async insertUsers() {
    if (this.isValid()) {
      let query = {
        text: "select insert_users($1, $2, $3, $4, $5, $6)",
        values: [
          this.username,
          this.firstName,
          this.lastName,
          this.email,
          this.employeeId,
          this.password,
        ],
      };

      const resultRaw = await callDatabase(query);

      let result = resultRaw.rows[0].insert_users;

      result = result.substr(1, result.length - 2);

      let resultSplit = result.split(",");

      const finalResult = {
        status: resultSplit[0] == "t" ? true : false,
        message: resultSplit[1],
        id: resultSplit[2],
      };

      return finalResult;
    }
  }

  async getDataByUsername(username) {
    let query = {
      text: "select user_id, username, first_name, last_name, email, employee_id, password from users where username = $1 fetch first 1 rows only",
      values: [username]
    }

    const result = await callDatabase(query);

    return result

  }

}

module.exports = Users;
