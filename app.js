var restify = require('restify');
const server = restify.createServer({
    name: 'Node.js REST API'
});
var setupController = require('./app/setupController');
var userController = require('./controllers/userController');
var restifyValidator = require('restify-validator');
const mongoose = require('mongoose');
const mongoDb = process.env.MONGODB_URL || 'mongodb://localhost:27017/nodejs_api';

mongoose.connect(mongoDb, { useNewUrlParser: true });
setupController(server, restify, restifyValidator);
userController(server);
var port = process.env.PORT || 8080;

server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
