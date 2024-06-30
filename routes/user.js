/* pour generer un token avec node
  > node('crypto).randomBytes(64|128).toString('hex')

*/

const express = require('express');
const connexion = require('../connexion');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// user signup handler
router.post('/signup', (req, res) => {
    let user = req.body;
    let query = "select name, email, password, role, status from user where email = ?";
    connexion.query(query,[user?.email], (err, results) => {
        if (err) {
            return res.status(500).json({"error": err})
        }
        //verification de doublon
        if(results.length > 0) {
            return res.status(400).json({"message": "Email already exists !"});
        }

        query = "insert into user(name,contactNumber,email,password, status,role) values(?,?,?,?,'false','user')";
        connexion.query(query,[user?.name,user?.contactNumber,user?.email,user?.password], (err, results) => {
            if (err) {
                return res.status(500).json({"error": err})
            }
            return res.status(200).json({"message": "Successfully registered"});
        });
    })
})

// user login handler
router.post('/login', (req, res) => {
    let user = req.body;
    let query = "select name, email, password, role, status from user where email = ?";
    connexion.query(query,[user?.email], (err, results) => {
        if (err) {
            return res.status(500).json({"error": err})
        }
        //verification de doublon
        if(results.length <= 0 || results[0].password != user?.password) {
            return res.status(401).json({message: "Incorrect Username or password"});
        }else if (results[0].status === 'false') {//le compte n'est pas encore active
            return res.status(401).json({message: "Wait for Admin Approval"});
        }else if (results[0].password ==  user?.password) {//generation du token d'authentification
            const response = {email: results[0].email, role:results[0].role};
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn:'4h'});
            return res.status(200).json({token:accessToken});
        }else {
            return res.status(400).json({message: "Something went wrong. Please try again later"});
        }
    })
});

// mailer configuration
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotpassword', (req,res) => {
    const user = req.body;
    let query = "select email, password from user where email=?";
    connexion.query(query,[user?.email],  (err, results) => {
        if (err){
            return res.status(500).json({error:err});
        }
        if (results.length <= 0) {
            return res.status(200).json({message:"Password sent successfully to your email"});
        } else {
            var mailOptions = {
                from : process.env.EMAIL,
                to : results[0].email,
                subject : 'Password by cafe management',
                html : '<p><b>Your Login details for cafe Management System</b> <br/> <b> Email : </b>'+ results[0].email +' <br/> <b> Password : </b>' + results[0].password + ' <br> <a href="http://localhost:4200/"> Click here to login </a> </p>'
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('Error : ' + error);
                }else {
                    console.log("Email sent : " + info.response);
                }
            });
            res.status(200).json({message: "Password sent successfully to your email address"});
        }

    })
});


// get all users
router.get('/getAllUsers', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = 'select id, name, email, contactNumber, status from user where role ="user"';
    connexion.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        res.status(200).json(results);
    })
});

// activer un compte utilisateur
router.patch('/update', auth.authenticateToken, checkRole.checkRole, function (req, res) {
    let user = req.body;

    var query = "update user set status = ? where id =?";
    connexion.query(query,[user?.status, user?.id], (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if ( results.affectedRows === 0 ) {
            return res.status(404).json({message : "User id does not exist"});
        } else {
            return res.status(200).json({message : "User updated successfully"});
        }
    });
});

// check token
router.get('/checkToken', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    return res.status(200).json({message : true});
});

// change password 
router.post('/changePassword', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req?.body;
    const email = res.locals?.email;
    let query = 'select *from user where email =? and password =?';
    connexion.query(query, [email,user?.oldPassword], (err, result) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if (result.length <= 0) {
            return res.status(400).json({message : "Incorrect Old password"});
        } else if ( user?.oldPassword === result[0].password) {
            query = 'update user set password = ? where email=?';
            connexion.query(query, [user?.newPassword, email], (err, result) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json({message : "Password updated successfully"});
            })
        } else {
            return res.status(500).json({message : "Something went wrong. Please try again later"});
        }

    })
})



module.exports = router