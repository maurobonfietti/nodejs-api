var restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

function respond(res, next, status, data, http_code) {
  var response = {
    'status': status,
    'data': data,
  }
  res.setHeader('content-type', 'application/json');
  res.writeHead(http_code);
  res.end(JSON.stringify(response));
  return next();
}

function success(res, next, data) {
  respond(res, next, 'success', data, 200);
}

function failure(res, next, status, data, http_code) {
  respond(res, next, 'failure', data, http_code);
}

server.get('/echo/:name', function (req, res, next) {
  console.log('mnb..!!');
  res.send(req.params);
  return next();
});

var users = {};

var max_user_id = 0;

server.get("/", function(req, res, next) {
	success(res, next, users);
});

server.get("/user/:id", function(req, res, next) {
  success(res, next, users[parseInt(req.params.id)]);
});

server.post("/user", function(req, res, next) {
	var user = req.body;
	max_user_id++;
	user.id = max_user_id;
	users[user.id] = user;
  success(res, next, user);
});

server.put("/user/:id", function(req, res, next) {
  var user = users[parseInt(req.params.id)];
  var updates = req.body;
  for (var field in updates) {
    user[field] = updates[field];
  }
  success(res, next, user);
});

server.del("/user/:id", function(req, res, next) {
  delete users[parseInt(req.params.id)];
	success(res, next, []);
});

server.get('/test', function (req, res, next) {
  res.setHeader('content-type', 'application/json');
  res.writeHead(201);
  res.end(JSON.stringify(users));
  console.log('test..!!');
//  res.send(req.params);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
