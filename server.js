// Imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

// Instance du server
const server = express();

// body parser configuration
server.use(bodyParser.urlencoded({ extended:true }));
server.use(bodyParser.json());


// Configure routes
server.get('/', (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({"response" : "Hello, world!"});
});

server.use('/api/',apiRouter)

// launch server
server.listen(8080,() =>{
    console.log(`server listening on :`);
});

