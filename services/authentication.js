require('dotenv').config();
const jwt = require('jsonwebtoken');

//verification du token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // recuperation de la valeur de l'autorisation
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err) 
            return res.sendStatus(403)
        res.locals = response;
        next();
    });
}   


module.exports = { authenticateToken : authenticateToken}