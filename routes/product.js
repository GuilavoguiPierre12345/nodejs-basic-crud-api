const express = require('express');
const connexion = require('../connexion');
const router = express.Router();

// services
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, function(req, res) {
    let product = req?.body;
    let query = 'insert into product(name, category_id, description, price, status) values(?,?,?,?,"true")';
    connexion.query(query,[product?.name,product?.category_id,product?.description,product?.price,product?.status], function(err, result){
        if (err) {
            return res.status(500).json({error : err});
        }
        return res.status(200).json({message : "Product add successfully"});
    })
});

// get all categories
router.get('/get', auth.authenticateToken, (req, res) => {
    var query = 'select p.id, p.name, p.description, p.price, p.status, c.name category from product p inner join category c on p.category_id = c.id';
    connexion.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        res.status(200).json(results);
    })
});

// get product By category 
router.get('/getByCategory/:id',auth.authenticateToken,checkRole.checkRole, function(req, res) {
    const id = req.params?.id;
    var query = 'select id, name from product where category_id=? and status = "true"';
    connexion.query(query,[id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result);
    })
});

// get product By category 
router.get('/getById/:id',auth.authenticateToken, function(req, res) {
    const id = req.params?.id;
    var query = 'select id, name,description,price from product where id=?';
    connexion.query(query,[id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result);
    })
});

// update product
router.patch('/update', auth.authenticateToken, checkRole.checkRole, function (req, res) {
    let product = req.body;

    var query = "update product set name = ?, category_id=?, description=?,price=? where id =?";
    connexion.query(query,[product?.name,product?.category_id, product?.description, product?.price, product?.id], (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if ( results.affectedRows === 0 ) {
            return res.status(404).json({message : "Product id does not found"});
        } else {
            return res.status(200).json({message : "Product updated successfully"});
        }
    });
});


// update product status
router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, function (req, res) {
    let product = req.body;

    var query = "update product set status = ? where id =?";
    connexion.query(query,[product?.status, product?.id], (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if ( results.affectedRows === 0 ) {
            return res.status(404).json({message : "Product id does not found"});
        } else {
            return res.status(200).json({message : "Product status updated successfully"});
        }
    });
});


// delete category
router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, function (req, res) {
    const id = req.params.id;
    var query = "delete from product where id =?";
    connexion.query(query,[id], (err, results) => {
        if (err) {
            return res.status(500).json({error : err});
        }
        if ( results.affectedRows === 0 ) {
            return res.status(404).json({message : "Product id does not found"});
        } else {
            return res.status(200).json({message : "Product deleted successfully"});
        }
    });
});
module.exports = router