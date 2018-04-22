module.exports = function(server, restify, restifyValidator) {
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  server.use(restifyValidator);

  var restifyPlugins = require('restify').plugins;
  server.use(restifyPlugins.authorizationParser());

  server.use(function(req, res, next) {
    var whitelistedIps = ['111.222.333.444', '127.0.0.1', '::1'];
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (whitelistedIps.indexOf(ip) === -1) {
      var response = {
        'status': 'failuse',
        'data': 'Invalid IP address',
        'ip': ip,
      };
      res.setHeader('content-type', 'application/json');
      res.writeHead(403);
      res.end(JSON.stringify(response));
      return response;
    }
    return next();
  });

  server.use(function(req, res, next) {
    var apiKeys = {
      'user1': 'user1'
    };
    if (typeof(req.authorization.basic) === 'undefined' || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]) {
      var response = {
        'status': 'failuse',
        'data': 'Your must specify a valid API key',
      };
      res.setHeader('content-type', 'application/json');
      res.writeHead(403);
      res.end(JSON.stringify(response));
      return response;
    }
    return next();
  });
}
