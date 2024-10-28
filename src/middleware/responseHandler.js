const Interface = require("../models/InterfaceLogs")

const responseHandler = (req, res, next) => {
    const dateNow = new Date()

    const idActivity = req.header("x-activity-id")
    
    const reqDuration =  dateNow - res.locals.reqTimeStart
    
    //Interface Log Section
    const InterfaceImpl = new Interface();
    InterfaceImpl.setObj(
        idActivity,
        res.locals.reqTimeStart,
        res.locals.userId,
        req.header("Authorization"),
        req.body,
        res.locals.payload,
        reqDuration,
        res.locals.reqTimeStart,
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