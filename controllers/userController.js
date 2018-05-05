var helpers = require('../config/helperFunctions');
var UserModel = require('../models/UserModel');

var UserServices = require('../services/userServices');

module.exports = function (server) {
    server.get("/", function (req, res, next) {
        UserServices.default(req, res, next);
    });

    server.get("/user", function (req, res, next) {
        UserServices.getAllUsers(req, res, next);
    });

    server.get("/user/:id", function (req, res, next) {
        req.assert('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors[0], 400);

        UserModel.findOne({_id: req.params.id}, function (err, user) {
            if (err) return helpers.failure(res, next, 'Error fetching user from the database', 400);
            if (user === null) return helpers.failure(res, next, 'The specified user could not be found in the database', 404);

            helpers.success(res, next, user, 200);
        });
    });

    server.post("/user", function (req, res, next) {
        req.assert('first_name', 'First name is required').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('email', 'Email is required and must be a email valid').notEmpty().isEmail();
        req.assert('career', 'Career must be either student, teacher or professor').isIn(['student', 'teacher', 'professor']);
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors, 400);

        var user = new UserModel();
        user.first_name = req.params.first_name;
        user.last_name = req.params.last_name;
        user.email = req.params.email;
        user.career = req.params.career;
        user.save(function (err) {
            if (err) return helpers.failure(res, next, 'Error saving user to the database', 400);

            helpers.success(res, next, user, 201);
        });
    });

    server.put("/user/:id", function (req, res, next) {
        req.assert('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors[0], 400);

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
    });

    server.del("/user/:id", function (req, res, next) {
        req.assert('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors[0], 400);

        UserModel.findOne({_id: req.params.id}, function (err, user) {
            if (err) return helpers.failure(res, next, 'Error fetching user from the database', 400);
            if (user === null) return helpers.failure(res, next, 'The specified user could not be found in the database', 404);

            user.remove(function (err) {
                if (err) return helpers.failure(res, next, 'Error removing user from to the database', 400);

                helpers.success(res, next, user, 204);
            });
        });
    });
};
