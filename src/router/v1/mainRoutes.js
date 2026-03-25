const express = require('express');
const router = express.Router();

const Services = require("../../models/Services");

//Register service
const { serviceRegister } = require('../../services/register/serviceRegister')
const { loginUser } = require('../../services/login/serviceLogin')
const { serviceAuthorizeToken } = require('../../services/authorize/serviceAuthorizeToken');
const { getListRoles } = require('../../services/roles/serviceGetListRoles');
const { serviceRefreshToken } = require('../../services/authorize/serviceRefreshToken');
const { getListUser } = require('../../services/user/getListUser');
const { getDetailUsers } = require('../../services/user/getDetailUser');
const { assignRoles } = require('../../services/roles/assignRoles');
const { getTokenByAuthCode } = require('../../services/token/serviceGetTokenByAuthCode');
const { getListScope } = require('../../services/scope/serviceGetListScope');
const { assignScope } = require('../../services/scope/assignScope');

router.route('/*').all(async (req, res, next) => {
    const serviceObj = new Services()
    res.locals = serviceObj.createNextAttribute(404, {
        status: "error",
        message: "resource not found",
    }, null, res.locals.status)

    next();
})

router.route('/users').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await serviceRegister(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/users/:id').all(async (req, res, next) => {
    switch (req.method) {
        case "GET":
            await getDetailUsers(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/users/list').all(async (req, res, next) => {
    switch (req.method) {
        case "GET":
            await getListUser(req, res);
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/user/roles').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await assignRoles(req, res);
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/login/users').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await loginUser(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/authorize/token').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await serviceAuthorizeToken(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/token/connect').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            switch (req.body.grant_type) {
                case "authorization_code":
                    await getTokenByAuthCode(req, res);
                    return next()
                
                default: 
                    const serviceObj = new Services()
                    res.locals = serviceObj.createNextAttribute(400, {
                        status: "error",
                        message: "Invalid Grant Type!",
                    }, null, "Invalid grant type")
                    next()
                    break;
            }
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/roles').all(async (req, res, next) => {
    switch (req.method) {
        case "GET":
            await getListRoles(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/roles/scope').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await assignScope(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/scope').all(async (req, res, next) => {
    switch (req.method) {
        case "GET":
            await getListScope(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

router.route('/refresh/token').all(async (req, res, next) => {
    switch (req.method) {
        case "POST":
            await serviceRefreshToken(req, res)
            next()       
            break;
    
        default:
            const serviceObj = new Services()
            res.locals = serviceObj.createNextAttribute(405, {
                status: "error",
                message: "Invalid http methods!",
            }, null, "Invalid http methods")
            next()
            break;
    }
})

module.exports = router