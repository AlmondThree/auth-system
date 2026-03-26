const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getDetailScope = async (req, res) => {
    const user = new Users();
    const service = new Services();

    service.createResponseObj();
    
    try {
        const scopeId = req.params.id;

        if(scopeId !== undefined && scopeId != '') {
            const data = await user.getScopeDetails(scopeId);
            if(data.status) {
                if(data.rowCount > 0) {
                    const dataRaw = data.data[0];
                    const dataList = {
                        id_scope: dataRaw.id_scope,
                        scope_name: dataRaw.scope_name,
                        description: dataRaw.description,
                        roles: (dataRaw.roles) ? dataRaw.roles.split('~') : [],
                    }
                    service.setResponseObj(200, {
                        status: true,
                        message: "ok",
                        data: dataList,
                    },null, null)
                } else {
                    service.setResponseObj(200, {
                        status: true,
                        message: "Data not found",
                    },null, null)
                }
                
            } else {
                service.setResponseObj(400, {
                    status: false,
                    message: data.message
                },null, data)
            }
        } else {
            service.setResponseObj(400, {
                status: false,
                message: "invalid input"
            }, null, "Scope Id Param is null or invalid type")
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

module.exports = {getDetailScope};