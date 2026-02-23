const { text } = require("body-parser");
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

      let finalResult;

      if (resultRaw.is_success) {
        let result = resultRaw.data[0].insert_users;

        result = result.substr(1, result.length - 2);

        let resultSplit = result.split(",");

        finalResult = {
          status: resultSplit[0] == "t" ? true : false,
          message: resultSplit[1],
          id: resultSplit[2],
        };
      } else {
        finalResult = {
          status: "error",
          message: resultRaw.message,
        };
      }

      return finalResult;
    }
  }

  async getDataByUsername(username) {
    let query = {
      text: "select user_id, username, first_name, last_name, email, employee_id, password from users where username = $1 fetch first 1 rows only",
      values: [username],
    };

    const responseDB = await callDatabase(query);

    return {
      status: responseDB.is_success ? responseDB.is_success : true,
      message: responseDB.message ? responseDB.message : null,
      rowCount: responseDB.rowCount,
      data: responseDB.data,
    };
  }

  async getDataByUserId(userId) {
    let query = {
      text: "select user_id, username, first_name, last_name, email, employee_id, password from users where user_id = $1 fetch first 1 rows only",
      values: [userId],
    };

    const responseDB = await callDatabase(query);

    return {
      status: responseDB.is_success ? responseDB.is_success : true,
      message: responseDB.message ? responseDB.message : null,
      rowCount: responseDB.rowCount,
      data: responseDB.data,
    };
  }

  async getRoleByUserId(userId) {
    let query = {
      text: "select role_name from user_role UR join role_mapping RM on UR.id_role = RM.id_role where RM.user_id = $1",
      values: [userId],
    };
    const responseDB = await callDatabase(query);

    return {
      status: responseDB.is_success ? responseDB.is_success : true,
      message: responseDB.message ? responseDB.message : null,
      rowCount: responseDB.rowCount,
      data: responseDB.data,
    };
  }

  async getRolesList() {
    let query = {
      text: "select role_name, description from user_role ur",
    };

    const responseDB = await callDatabase(query);

    return {
      status: responseDB.is_success ? responseDB.is_success : true,
      message: responseDB.message ? responseDB.message : null,
      rowCount: responseDB.rowCount,
      data: responseDB.data,
    };
  }

  async getListUsers(page, size, q) {

    let whereClaues = (q !== undefined && q !== "") ? "where username ilike $3 or employee_id ilike $3 or u.user_id::text ilike $3" : '';

    let query = {
      text: `select user_id, username, first_name, last_name, email, employee_id from users u ${whereClaues} order by user_id limit $1 offset $2`,
      values: (whereClaues != '') ? [page, size, `%${q}%`] : [page, size],
    };

    let pages = {
      page: Number(page),
      size: Number(size),
      total_data: null,
      last_page: null,
    }

    if(page == null || page === 'undefined' || size == null || size === 'undefined' || page < 1 || size < 1) {
      query.values[0] = 1;
      query.values[1] = 0;
      pages = null;
    } else {
      let offset = (page - 1) * size;

      query.values[0] = Number(size);
      query.values[1] = offset;

      const whereQueryTotal = whereClaues;

      const queryTotal = {
        text: `select count(*) as totalRows from users u ${whereQueryTotal.replaceAll("$3", "$1")}`,
        values: (whereClaues != '') ? [`%${q}%`] : []
      }

      const callPages = await callDatabase(queryTotal);

      if(callPages.is_success) {  
        pages.total_data = Number(callPages.data[0].totalrows);
        pages.last_page = Math.ceil(callPages.data[0].totalrows / size)
      }

    }

    const responseDB = await callDatabase(query);

    return {
      status: responseDB.is_success ? responseDB.is_success : false,
      message: responseDB.message ? responseDB.message : null,
      rowCount: responseDB.rowCount,
      pages: pages,
      data: responseDB.data,
    };
  }

  async getUserDetails(userId) {

    if(userId !== undefined && userId != '') {
        let query = {
        text: `
          select 
            u.user_id,
            u.username,
            u.first_name,
            u.last_name, 
            u.email, 
            u.employee_id,
            string_agg(ur.role_name, '~') as roles
          from users u
          join role_mapping rm on u.user_id = rm.user_id 
          join user_role ur on rm.id_role = ur.id_role 
          where u.user_id = $1
          group by u.user_id 
        `,
        values: [userId]
      }

      const responseDB = await callDatabase(query);

      return {
        status: responseDB.is_success ? responseDB.is_success : false,
        message: responseDB.message ? responseDB.message : null,
        rowCount: responseDB.rowCount,
        data: responseDB.data,
      };
    } else {
      return {
        status: false,
        message: "userId is null or invalid datatype",
      }
    }

  }
}

module.exports = Users;
