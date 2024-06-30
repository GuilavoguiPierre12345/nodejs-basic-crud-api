// Imports 
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.util');
const models = require('../models');

// Routes
module.exports = {
    register : (req,res)=>{
        // Params
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const bio = req.body.bio;
        // Verification des parameters
        if (email == null || username == null || password == null) {
            return res.status(400).json({"error":"missing required parameters"});
        }

        // Verifier l'email, username, password et bio

        // Verification de doublons dans la base de données
        models.User.findOne({
            attributes: ['email'],
            where : {email: email}
        })
        .then((userFound) => {
            if (!userFound){
                bcrypt.hash(password,5,(err,encryptedPassword)=>{
                    const newUser = models.User.create(
                        {
                            email: email,
                            username:username,
                            password:encryptedPassword,
                            bio:bio,
                            isAdmin: 0
                        }
                    )
                    .then((newUser) => {
                        res.status(201).json({'userId':newUser.id})
                    })
                    .catch((err) => {
                        res.status(500).json({'error':'cannot add user'});
                    })
                })
            }else{
                return res.status(409).json({'error':'user already exists'})
            }
        }).catch((err) => {
            return res.status(500).json({'error': 'unable to verify user'})
        });

    },

    login : (req,res)=>{
        // Params 
        const email = req.body.email;
        const password = req.body.password;

        // Verification des parameters
        if (email == null || password == null) {
            return res.status(400).json({"error":"missing required parameters"});
        }

        // verifier l'email avec un regex 


        // Control de doublons
        models.User.findOne({
            where : {email :email}
        })
        .then((userFound) => {
            if (userFound){
                bcrypt.compare(password,userFound.password,(errorBycrypt,resBycrypt)=>{
                    if (resBycrypt) {
                        return res.status(200).json({
                            'userId':userFound.id,
                            'token':jwtUtils.generateTokenForUser(userFound)
                        })
                    }else {
                        return res.status(403).json({'error':'invalid password'})
                    }
                })
            }else{
                return res.status(409).json({'error':'user not exists'})
            }

        }).catch((err) => {
            return res.status(500).json({'error': 'unable to verify user'})
        });


    }
}