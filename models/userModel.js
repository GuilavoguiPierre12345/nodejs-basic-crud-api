const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    refreshToken : {
        type:String,
        default :null,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:[{type:mongoose.Schema.Types.ObjectId,ref:"Address",}],
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}],
   
},{
    timestamps:true,
});

//methode pour hasher le password avant l'enregistrement
userSchema.pre('save',async function (next){
   const salt = bcrypt.genSaltSync(10);
   const hash = bcrypt.hashSync(this.password, salt);
   this.password = hash;
   next();
});

// methods pour decrypter le mot de password avant le login
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Export the model
const usermodel = mongoose.model('User', userSchema);
module.exports = usermodel;