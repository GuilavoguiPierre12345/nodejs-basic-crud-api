// mongoose instance
const mongoose = require('mongoose');

//Schema instances
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
// create producst schema
const categorySchema = new Schema(
    {
        _id : {type : objectId, auto : true,},
        name : {type : String, required : true}
    }, 
    {timestamps : true}
);

//create a model
const category = mongoose.model('category', categorySchema)
//export category model
module.exports = category ;
