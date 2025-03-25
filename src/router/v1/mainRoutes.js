const express = require('express');
const router = express.Router();

//Register service
const { serviceRegister } = require('../../services/register/serviceRegister')
const { loginUser } = require('../../services/login/serviceLogin')
const { sericeAuthorizeToken } = require('../../services/authorize/serviceAuthorizeToken')

router.route('/users').post(async (req, res, next) => {
    await serviceRegister(req, res)
    next()
})

router.route('/login/users').post(async (req, res, next) => {
    await loginUser(req, res)
    next()
})

router.route('/authorize/token').post(async (req, res, next) => {
    await sericeAuthorizeToken(req, res)
    next()
})

module.exports = router