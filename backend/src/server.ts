require('rootpath')();
import express from "express";
const app = express();

const  cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./jwt');
const errorHandler=require('./error-handler');

const port = 3000;

const http = require("http");
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use('/', require('./users/users.controller'));
app.use('/', require('./tables/tables.controller'));
app.use('/', require('./dishes/dishes.controller'));
app.use('/', require('./orders/orders.controller'));
app.use(errorHandler);

server.listen(port, function () {
    console.log('Server listening on port ' + port);
});