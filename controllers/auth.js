const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email entered already exist.'
            });
        }

        const dbUser = new User( req.body );

        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        const token = await generateJWT( dbUser.id, name );

        await dbUser.save();

        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the admin.'
        });
    }
}

const login = async(req, res) => {

    const { email, password } = req.body;

    try {
        const dbUser = await User.findOne({ email });
        
        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email and/or password are not correct'
            });
        }
        
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email and/or password are not correct'
            });
        }

        const token = await generateJWT( dbUser.id, dbUser.name );

        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the admin.'
        });
    }

    return res.json({
        ok: true,
        msg: 'Login user /'
    })
}

const renewToken = async(req, res) => {

    const { uid, name, email } = req;

    const token = await generateJWT( uid, name );

    return res.json({
        ok: true,
        uid,
        name,
        email,
        token
    })
}

module.exports = {
    createUser,
    login,
    renewToken
}