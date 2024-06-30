const category = require('../models/category.model');
const { BaseController } = require('../repository/base.controller');

class CategoryController extends BaseController{
    constructor(){
        super(category)
    }
};

// Export de class
module.exports = {CategoryController};