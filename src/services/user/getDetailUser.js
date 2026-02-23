const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getDetailUsers = async (req, res) => {
    const user = new Users();
    const service = new Services();

    service.createResponseObj();
    
    try {
        const userId = req.params.id;

        if(userId !== undefined && userId != '') {
            const data = await user.getUserDetails(userId);
            if(data.status) {
                if(data.rowCount > 0) {
                    const dataList = data.data.map((item) => {
                        return {
                            id: item.user_id,
                            username: item.username,
                            firstName: item.first_name,
                            lastName: item.last_name,
                            email: item.email,
                            employeeId: item.employee_id,
                            roles: item.roles.split("~")
                        }
                    })
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
            }, null, "User Id Param is null or invalid type")
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

module.exports = {getDetailUsers};