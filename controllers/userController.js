var helpers = require('../config/helperFunctions');

// Fake Database.
var users = {};
var max_user_id = 0;

module.exports = function(server) {
    server.get("/", function(req, res, next) {
    	helpers.success(res, next, users);
    });

    server.get("/user/:id", function(req, res, next) {
      req.assert('id', 'Id is required and must be numeric').notEmpty().isInt();
      var errors = req.validationErrors();
      if (errors) {
        return helpers.failure(res, next, errors[0], 400);
      }
      if (typeof(users[req.params.id]) === 'undefined') {
        return helpers.failure(res, next, 'The specified user could not be found in the database', 404);
      }
      helpers.success(res, next, users[parseInt(req.params.id)]);
    });

    server.post("/user", function(req, res, next) {
    	var user = req.body;
    	max_user_id++;
    	user.id = max_user_id;
    	users[user.id] = user;
      helpers.success(res, next, user);
    });

    server.put("/user/:id", function(req, res, next) {
      if (typeof(users[req.params.id]) === 'undefined') {
        return helpers.failure(res, next, 'The specified user could not be found in the database', 404);
      }
      var user = users[parseInt(req.params.id)];
      var updates = req.body;
      for (var field in updates) {
        user[field] = updates[field];
      }
      helpers.success(res, next, user);
    });

    server.del("/user/:id", function(req, res, next) {
      if (typeof(users[req.params.id]) === 'undefined') {
        return helpers.failure(res, next, 'The specified user could not be found in the database', 404);
      }
      delete users[parseInt(req.params.id)];
    	helpers.success(res, next, []);
    });
}
