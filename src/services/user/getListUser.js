const Users = require("../../models/Users");
const Services = require("../../models/Services");

const getListUser = async (req, res) => {
    const user = new Users();
    const service = new Services();

    service.createResponseObj();
    
    try {
        const page = req.query['page'];
        const size = req.query['size'];
        const q = req.query['q'];
        const data = await user.getListUsers(page, size, q);

        if(data.status) {
            if(data.rowCount > 0) {
                const dataList = data.data.map((item) => {
                    return {
                        userId: item.user_id,
                        username: item.username,
                        employeeId: item.employee_id,
                    }
                })
                service.setResponseObj(200, {
                    status: true,
                    pages: data.pages,
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

module.exports = {getListUser};