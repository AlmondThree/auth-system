const jwt = require('jsonwebtoken')
const {createSessionId} = require('./createSessionId')

const createJWT = (data) => {
    let dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + 120);
    dateNow = new Date(dateNow);

    let dataToken = {
        user_id: data.user_id,
        username: data.username,
        employee_id: data.employee_id,
        roles: data.roles,
        session_id: createSessionId(24),
        expired: dateNow
    }

    const token = jwt.sign(
        dataToken,
        `!${data.username}+${data.employee_id}&`,
        {
            expiresIn: '2h'
        }
    )

    return token;
}

module.exports = { createJWT };