var helpers = require('../config/helperFunctions');
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

        UserServices.getOneUser(req, res, next, req.params.id);
    });

    server.post("/user", function (req, res, next) {
        req.assert('first_name', 'First name is required').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('email', 'Email is required and must be a email valid').notEmpty().isEmail();
        req.assert('career', 'Career must be either student, teacher or professor').isIn(['student', 'teacher', 'professor']);
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors, 400);

        UserServices.create(req, res, next);
    });

    server.put("/user/:id", function (req, res, next) {
        req.assert('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors[0], 400);

        UserServices.update(req, res, next);
    });

    server.del("/user/:id", function (req, res, next) {
        req.assert('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) return helpers.failure(res, next, errors[0], 400);

        UserServices.delete(req, res, next);
    });
};
