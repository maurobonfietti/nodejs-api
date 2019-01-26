var helpers = require('../config/helperFunctions');
var UserModel = require('../models/UserModel');

module.exports.default = function (req, res, next) {
    var response = {
        'message': 'Welcome to NodeJS API!',
        'version': '1.0.2',
        'get-all-users': {
            'GET': '/user'
        },
        'get-one-user': {
            'GET': '/user/5aeb9f91659d9896dd44243d'
        },
        'create-user': {
            'POST': '/user'
        },
        'update-user': {
            'PUT': '/user/5aeb9fbdc6173a9732c32559'
        },
        'delete-user': {
            'DELETE': '/user/5adced8d75acfd076c57f9b3'
        }
    };
    helpers.success(res, next, response, 200);
};

module.exports.getAllUsers = function (req, res, next) {
    UserModel.find({}, function (err, users) {
        helpers.success(res, next, users, 200);
    });
};

module.exports.getOneUser = function (req, res, next, id) {
    UserModel.findOne({_id: id}, function (err, user) {
        if (err) return helpers.failure(res, next, 'Error fetching user from the database', 400);
        if (user === null) return helpers.failure(res, next, 'The specified user could not be found in the database', 404);

        helpers.success(res, next, user, 200);
    });
};

module.exports.create = function (req, res, next) {
    var user = new UserModel();
    user.first_name = req.params.first_name;
    user.last_name = req.params.last_name;
    user.email = req.params.email;
    user.career = req.params.career;
    user.save(function (err) {
        if (err) return helpers.failure(res, next, 'Error saving user to the database', 400);

        helpers.success(res, next, user, 201);
    });
};

module.exports.update = function (req, res, next) {
    UserModel.findOne({_id: req.params.id}, function (err, user) {
        if (err) return helpers.failure(res, next, 'Error fetching user from the database', 400);
        if (user === null) return helpers.failure(res, next, 'The specified user could not be found in the database', 404);

        var updates = req.body;
        delete updates.id;
        for (var field in updates) {
            user[field] = updates[field];
        }
        user.save(function (err) {
            if (err) return helpers.failure(res, next, 'Error saving user to the database', 400);

            helpers.success(res, next, user, 200);
        });
    });
};

module.exports.delete = function (req, res, next) {
    UserModel.findOne({_id: req.params.id}, function (err, user) {
        if (err) return helpers.failure(res, next, 'Error fetching user from the database', 400);
        if (user === null) return helpers.failure(res, next, 'The specified user could not be found in the database', 404);

        user.remove(function (err) {
            if (err) return helpers.failure(res, next, 'Error removing user from to the database', 400);

            helpers.success(res, next, user, 204);
        });
    });
};
