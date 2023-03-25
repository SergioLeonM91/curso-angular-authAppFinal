const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const validateJWT = async(req, res = response, next) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'Token does not exist - unauthorized'
        })
    }

    try {
        
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );

        const user = await User.findById( uid );

        if( !user ) {
            return res.status(401).json({
                msg: 'Token not valid - unauthorized'
            })
        }

        req.uid = uid;
        req.name = name;
        req.email = user.email;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token not valid - unauthorized'
        })
    }

}

module.exports = {
    validateJWT
}