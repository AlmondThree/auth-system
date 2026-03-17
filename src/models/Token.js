const { connectMongo } = require("../utils/mongodb/connectMongo");

class Token {
    constructor() {
        
    }

    async insertTokenMongo(authCode, accessToken, refreshToken, isActive) {
        const mongo = await connectMongo();

        const mongoClient = mongo.getInstance();

        try {
            await mongoClient
                .db('db_data')
                .collection('token')
                .insertOne({
                    auth_code: authCode,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    isActive: isActive,
                })
        } catch (error) {
            console.log(error)
        }
    }

    async getTokenByAuthCode(authCode) {
        const mongo = await connectMongo();

        const mongoClient = mongo.getInstance();

        try {
            const data = await mongoClient
                .db('db_data')
                .collection('token')
                .findOne({
                    auth_code: authCode,
                    isActive: true
                })

            return {
                isSuccess: true,
                message: "Success get data!",
                data: data
            };
        } catch (error) {
            return {
                isSuccess: false,
                message: error.toString(),
            }
        }
    }

    async updateTokenStatus(authCode) {
        const mongo = await connectMongo();

        const mongoClient = mongo.getInstance();

        try {
            await mongoClient
                .db('db_data')
                .collection('token')
                .updateOne({auth_code: authCode,},
                    {
                        $set: {isActive: false}
                    }
                )

            return {
                isSuccess: true,
                message: "Success update data!"
            };
        } catch (error) {
            return {
                isSuccess: false,
                message: error.toString(),
            }
        }
    }
}

module.exports = Token;