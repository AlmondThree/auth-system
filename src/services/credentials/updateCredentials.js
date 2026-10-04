const Services = require("../../models/Services");
const { getCredentials, updateCredentials } = require("../../utils/mongodb/credentials");
const { encrypt } = require("../../utils/encryption/encrypt");
const { decrypt } = require("../../utils/encryption/decrypt");

const updateCredentialsServices = async (req, res) => {
  const service = new Services();

  service.createResponseObj();

  try {

    if (req.params.dbName) {

        let existingData = await getCredentials(req.params.dbName);

        if (existingData.length > 0 ) {
            const data = existingData[0];

            const decryptedData = decrypt(data.encryptedData);

            const parsedData = JSON.parse(decryptedData);
            
            if(req.body.hostname) {
                parsedData.hostname = req.body.hostname;
            }
            if(req.body.port) {
                parsedData.port = req.body.port;
            }
            if(req.body.username) {
                parsedData.username = req.body.username;
            } 
            if(req.body.password) {
                parsedData.password = req.body.password;
            }

            const dataString = JSON.stringify(parsedData);

            const encryptedData = encrypt(dataString);

            let updatedData = {
                $set: {
                    encryptedData: encryptedData,
                    isActive: ( req.body.isActive !== undefined && req.body.isActive !== null) ? req.body.isActive : data.isActive,       
                }
            }

            let resMongo = await updateCredentials(req.params.dbName, updatedData);

            if (resMongo.acknowledged) {
                service.setResponseObj(
                    200,
                    {
                    status: true,
                    message: "Success update data",
                    id: resMongo.insertedId,
                    },
                    null,
                    null,
                );

                } else {
                service.setResponseObj(
                    400,
                    {
                    status: false,
                    message: "Invalid payload!",
                    },
                    null,
                    resMongo.errorMessage,
                );
            }

        } else {
            service.setResponseObj(
                200,
                {
                status: true,
                message: "Data not found!",
                data: null,
                },
                null,
                null,
            );
        }
        
    } else {
        service.setResponseObj(
            400,
            {
            status: false,
            message: "Invalid payload: dbName is required!",
            },
            null,
            "Missing dbName in request body",
        );
    }

    
  } catch (error) {
    let errorPayload = {
      status: false,
      message: "Internal server error",
    };
    service.setResponseObj(500, errorPayload, null, error.toString());
  }

  req.body.password = "***";

  let response = service.getResponseObj();

  res.locals = service.createNextAttribute(
    response.statusCode,
    response.payload,
    response.headers,
    response.errorMessage,
  );
};

module.exports = { updateCredentialsServices };
