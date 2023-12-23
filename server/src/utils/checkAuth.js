const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (context) => {
    // the context = { ...headers }
    // console.log(context.req.headers.authorization)
    const authHeader = context.req.headers.authorization;
    if(authHeader) {
        // Bearer ...
            const authToken = authHeader.split('Bearer ')[1];
            // console.log(authToken);
            if(authToken !== null) {
                try {
                    // console.log(process.env.JWT_SECRET)
                    const user = jwt.verify(authToken, process.env.JWT_SECRET)
                    // console.log(user.username)
                    return user;
                } catch (error) {
                    throw new Error(error)
                }
            }
            throw new Error("token not valid or expired")
    }
    throw new Error('user not authenticated..')
}

module.exports = verifyToken;