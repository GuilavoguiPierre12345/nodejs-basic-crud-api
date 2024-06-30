// Imports
const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConfig');
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
// Instance 
const app = express()

dbConnect();
//convertir les body en json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/api/user",authRouter)

//gestion des erreurs 
app.use(notFound);
app.use(errorHandler);

// Server listening
app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
});







