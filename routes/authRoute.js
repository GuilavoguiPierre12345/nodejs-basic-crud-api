// Imports
const express = require('express');
const router = express.Router(); // router instance
const {
    createUser, 
    loginUser, 
    getAllUser, 
    getAUser, 
    deleteAUser,
    updateAUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
} = require("../controller/userCtrl");
const {
    authMiddleware, 
    isAdmin
} = require('../middlewares/authMiddleware');

// route for user registration
router.post("/register",createUser); 
//route for user login
router.post("/login",loginUser)
// route to handle de cookie refreshing
router.get("/refresh", handleRefreshToken);
//route for all users
router.get("/all-users", authMiddleware, getAllUser);
// route get a user
router.get("/:id",authMiddleware,isAdmin, getAUser)
// route delete a user
router.delete("/:id", deleteAUser);
// route Update a user
router.put("/edit-user/:id", authMiddleware,updateAUser);
// route to block an user
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
// route to unblock user
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);



module.exports = router;