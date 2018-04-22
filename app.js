var restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var setupController = require('./controllers/setupController');
var userController = require('./controllers/userController');
var restifyValidator = require('restify-validator');
var config = require('./config/dbConnection');

const mongoose = require('mongoose');

mongoose.connect(config.getMongoConnection());

setupController(server, restify, restifyValidator);
userController(server);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
