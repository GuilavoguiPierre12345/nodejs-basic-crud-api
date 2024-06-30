require('dotenv').config();
const http = require('http'); // http server
const app = require('./index');

const server = http.createServer(app);
server.listen(process.env.PORT); // mise en ecoute du server

