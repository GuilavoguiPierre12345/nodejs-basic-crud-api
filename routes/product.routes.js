const express = require('express');
const { ProductController } = require('../controller/product.controller');
const router = express.Router();

// Instance of CategoryController class
const productController = new ProductController();

router.get("/all-products", productController.getAllDocuments);
router.get("/:id", productController.getADocument);
router.post("/add-product", productController.addDocument);
router.put("/update-product/:id", productController.updateDocument);
router.delete("/delete-product/:id", productController.deleteDocument);

module.exports = router;