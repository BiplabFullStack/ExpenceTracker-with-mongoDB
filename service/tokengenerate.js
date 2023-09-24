const jwt = require('jsonwebtoken')

const generateAccessToken = (id,name,email) => {
    return jwt.sign({userId:id,firstName:name,email},process.env.secret)
}

module.exports.generateAccessToken = generateAccessToken;