// Imports
const jwt = require('jsonwebtoken');


const JWT_SIGN_SECRET = "kfjskl534jkljkl63kl45jhkjk3jhjkjkh5kj3";
// Export modules
module.exports = {
    generateTokenForUser:(userData)=>{
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn :"1h"
        }
        )
    }
}