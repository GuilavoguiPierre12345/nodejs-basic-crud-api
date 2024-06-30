const express = require('express');
const { CategoryController } = require('../controller/category.controller');

const router = express.Router();

// Instance of CategoryController class
const categoryController = new CategoryController();

router.get("/all-categories", categoryController.getAllDocuments);
router.get("/:id", categoryController.getADocument);
router.post("/add-category", categoryController.addDocument);
router.put("/update-category/:id", categoryController.updateDocument);
router.delete("/delete-category/:id", categoryController.deleteDocument);

module.exports = router;