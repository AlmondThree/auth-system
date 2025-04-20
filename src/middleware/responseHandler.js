const Interface = require("../models/InterfaceLogs")

const responseHandler = (req, res, next) => {
    const dateNow = new Date()

    const idActivity = req.header("x-activity-id")
    
    const reqDuration =  dateNow - res.time.reqTime

    //Interface Log Section
    const InterfaceImpl = new Interface();
    InterfaceImpl.setObj(
        idActivity,
        res.locals.reqTimeStart,
        res.locals.userId,
        req.header("Authorization"),
        req.body,
        (res.locals.status == 500) ? res.locals.errorMessage.toString() : res.locals.payload,
        reqDuration,
        res.time.reqTime,
        dateNow
    )
    InterfaceImpl.sendLogs("interface_logs");

    //Response Handler Section
    res.status(res.locals.status)
    res.send(res.locals.payload)
}

module.exports = {
    responseHandler
}