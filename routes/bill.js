const express = require('express');
const connexion = require('../connexion');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let fs = require('fs'); // un module perso a node js
let uuid = require('uuid');

// services
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    let query = 'insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values (?,?,?,?,?,?,?,?)';
    connexion.query(query,[orderDetails?.name,generatedUuid, orderDetails?.contactNumber, orderDetails?.email, orderDetails?.contactNumber, orderDetails?.paymentMethod, orderDetails?.totalAmount, orderDetails?.productDetails, res.locals.email, (err, result) => {
        if (err) return res.status(500).json(err);
        ejs.renderFile(path.join(__dirname,'','report.ejs'), {productDetails: productDetailsReport, name : orderDetails?.name, email : orderDetails?.email, contactNumber : orderDetails?.contactNumber, paymentMethod : orderDetails?.paymentMethod, totalAmount : orderDetails?.totalAmount}, (err, results) => {
            if (err) return res.status(500).json(err);
            pdf.create(data).toFile('./generatedPdf/' + generatedUuid +".pdf", function(err,data){
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                } else {
                    return res.status(200).json({uuid : generatedUuid });
                }
            })
        })
    } ])
})


module.exports = router;