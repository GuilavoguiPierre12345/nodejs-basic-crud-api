const mysql = require('mysql');
require('dotenv').config();

const connexion = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connexion.connect( (error) => {
    if (error){
        console.log(`Error connecting to database : ${error}`);
        return;
    }
    console.log(`Connecting to database`);
});

module.exports = connexion;