//Imports
const express = require('express');
const { getConnection } = require('./config/db');
require('dotenv').config(); // load environment variables from .env file

// Instance
app = express();
app.use(express.json());
PORT = process.env.PORT || 3000;

//connection to database
getConnection();

//API route 
const apiRoutes = require("./routes/api.routes");
app.use("/api", apiRoutes);

//mettre le server en ecoute
app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`);
});