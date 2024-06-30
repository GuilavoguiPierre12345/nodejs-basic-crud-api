const express = require('express');
const connexion = require('../connexion');
const router = express.Router();

// services
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, function(req, res) {
    let category = req?.body;
    let query = 'insert into category(name) values(?)';
    connexion.query(query,[category?.name], function(err, result){
        if (err) {
            return res.status(500).json({error : err});
        }
        return res.status(200).json({message : "Category add successfully"});
    })
});

// get all categories
router.get('/get', auth.authenticateToken, (req, res) => {
    var query = 'select *from category order by id desc';
    connexion.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        res.status(200).json(results);
    })
});

// update category
router.patch('/update', auth.authenticateToken, checkRole.checkRole, function (req, res) {
    let product = req.body;

    var query = "update category set name = ? where id =?";
    connexion.query(query,[product?.name, product?.id], (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if ( results.affectedRows === 0 ) {
            return res.status(404).json({message : "Category id does not found"});
        } else {
            return res.status(200).json({message : "Category updated successfully"});
        }
    });
});

module.exports = router