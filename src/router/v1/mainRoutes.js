const express = require('express');
const router = express.Router();

//Register service
const { serviceRegister } = require('../../services/register/serviceRegister')
const { loginUser } = require('../../services/login/serviceLogin')

router.route('/users').post(async (req, res, next) => {
    await serviceRegister(req, res)
    next()
})

router.route('/login/users').post(async (req, res, next) => {
    await loginUser(req, res)
    next()
})

module.exports = router