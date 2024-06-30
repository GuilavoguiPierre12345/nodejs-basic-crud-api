const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require('jsonwebtoken');

//la methode de creation d'un user
const createUser = asyncHandler(
    async (req,res) => {
        // control de doublon
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if (!findUser) {
            // create a new user
            const newUser = await User.create(req.body)
            res.json(newUser);
        }else {
            res.json({
                msg:"User Already Exists",
                success: false
            });
            
        }
    }
);

// la methode de connexion 
const loginUser = asyncHandler(async (req, res,next) => {
    const {email, password} = req.body;
    //verifier si l'utilisateur existe et que son password est correct
    const findUser =await User.findOne({email:email});
    if (findUser && (await findUser.isPasswordMatched(password))) {
        // regeneration du token d'un utilisateur
        const refreshToken = await generateRefreshToken(findUser?._id);
        // mettre a jour les informations de l'utilisateur
        const updateUser = await User.findOneAndUpdate(
            findUser?._id,{
            refreshToken : refreshToken
        },{
            new : true
        });
        //ecrire un coockie pour le refresh du token
        res.cookie("refreshToken", refreshToken,{
            httpOnly : true,
            maxAge : 72*60*60*1000
        });
        res.json({
            _id: findUser?._id,
            firstName:findUser?.firstName,
            lastname:findUser?.lastName,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token :generateToken(findUser?._id)
        })
    } else {
        res.json({error : "Invalid credentials"})
    }
});

// la methode de gestion de cookie
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)  throw new Error(`No Refresh Token in cookies`);
    const refreshToken = cookie.refreshToken;
    const user = User.findOne({refreshToken:refreshToken});
    // if (!user) throw new Error(`No Refresh token present in db or not matched`);
    console.log(user);
    // res.json(user);
});

// Get All Users
const getAllUser = asyncHandler(async (req, res, next) => {
    try {
        const getUsers = await User.find();
        res.json({response: getUsers})
    } catch (error) {
        throw new Error(error)   
    }
});

// Get A User 
const getAUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    const getUser = await User.findById(id);
    res.json({response : getUser})
});

// Delete A User 
const deleteAUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({response : deleteUser})
});

// Update A User
const updateAUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
        });
    res.json({response : updateUser})
    } catch (error) {
        throw new Error(error)
    }
});

// block an user
const blockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, 
            {
            isBlocked:true,
        },
        {
            new : true
        }
        );
        res.json({
            response : "User Blocked",
            user : block
        });
    } catch (error) {
        throw new Error(error);
    }
})

// unblock an user
const unblockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, 
            {
            isBlocked:false,
        },
        {
            new : true
        }
        );
        res.json({response : "User unblocked successfully", user: unblock});
    } catch (error) {
        throw new Error(error);
    }
})


// Export
module.exports = {
    createUser, 
    loginUser,
    getAllUser,
    getAUser,
    deleteAUser,
    updateAUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
}