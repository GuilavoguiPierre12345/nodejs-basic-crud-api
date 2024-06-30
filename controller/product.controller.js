const product = require('../models/product.model');
const { BaseController } = require('../repository/base.controller');

class ProductController extends BaseController{
   constructor() {
    super(product);
   }
};
// Export de class
module.exports = {ProductController};