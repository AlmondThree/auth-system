const Users = require("../../models/Users");
const Services = require("../../models/Services");
const { validateReqPayload } = require("../../utils/general/validateReqPayload");
const serviceConfig = require("../../config/json/servicesConfig.json");

const assignScope = async (req, res) => {
    const user = new Users();
    const service = new Services();

    service.createResponseObj();
    
    try {
        const reqBody = req.body;

        //Validasi
        const isReqBodyValid = validateReqPayload(reqBody, serviceConfig.assign_scope["mandatory_parameter"]);

        if(isReqBodyValid) {
            const data = {
                scopeId: reqBody.scopeId,
                roleId: (reqBody.roleId instanceof Array) ? reqBody.roleId : null,
            }

            let responseList = [];

            for(let id of data.roleId) {
                const response = await user.assign_scope(id, data.scopeId);
                responseList.push(response);
            }

            service.setResponseObj(200, {
                status: true,
                data: responseList,
            },null, null)

        } else {
            let errorPayload = {
                status: false,
                message: "Invalid request payload",
            };
            service.setResponseObj(400, errorPayload, null, errorPayload.message);
        }
        
        
    } catch (e) {
        let errorPayload = {
            status: false,
            message: "Internal server error",
        };
        service.setResponseObj(500, errorPayload, null, e.toString());
    }

    let response = service.getResponseObj();

    res.locals = service.createNextAttribute(
        response.statusCode,
        response.payload,
        response.headers,
        response.errorMessage
    );

}

module.exports = {assignScope};