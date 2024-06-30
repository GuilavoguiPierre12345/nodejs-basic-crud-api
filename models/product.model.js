// mongoose instance
const mongoose = require('mongoose');

//Schema instances
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
// create producst schema
const productSchema = new Schema({
    _id : {type : objectId, auto : true,},
    name : {type : String, required : true},
    unitPrice : {type : Number, required : true},
    categoryId :{type : objectId, ref : 'category'}
}, {
    versionKey : false,
}, 
    {timestamps : true}
);

//create a model
const product = mongoose.model('products', productSchema)
//export category model
module.exports = product ;
