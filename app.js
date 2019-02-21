const restify = require('restify');
const server = restify.createServer({name: 'Node.js REST API'});
const setup = require('./app/setup');
const user = require('./controllers/user');
const restifyValidator = require('restify-validator');
const mongoose = require('mongoose');
const mongoDbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/nodejs_api';
const port = process.env.PORT || 8080;

mongoose.connect(mongoDbUrl, {useNewUrlParser: true});
setup(server, restify, restifyValidator);
user(server);
server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
