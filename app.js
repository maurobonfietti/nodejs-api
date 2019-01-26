var restify = require('restify');

const server = restify.createServer({
    name: 'NodeJS API',
    version: '1.0.1'
});

var setupController = require('./controllers/setupController');
var userController = require('./controllers/userController');
var restifyValidator = require('restify-validator');

const mongoose = require('mongoose');
const mongoDb = process.env.MONGODB_URL || 'mongodb://localhost:27017/nodejs_api';

mongoose.connect(mongoDb);

setupController(server, restify, restifyValidator);

userController(server);

var port = process.env.PORT || 8080;

server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
