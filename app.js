var restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  console.log('mnb..!!');
  res.send(req.params);
  return next();
});

var users = {};

var max_user_id = 0;

server.get("/", function(req, res, next) {
	res.setHeader('content-type', 'application/json');
	res.writeHead(200);
	res.end(JSON.stringify(users));
	return next();
});

server.post("/user", function(req, res, next) {
	var user = req.body;
	max_user_id++;
	user.id = max_user_id;
	users[user.id] = user;
	res.setHeader('content-type', 'application/json');
	res.writeHead(200);
	res.end(JSON.stringify(users));
	return next();
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
