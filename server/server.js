var express = require('express');
var app = express();

var mountApi = require('./boot/routes');

// mount static files
app.use(express.static(__dirname + '/../client/src'));

// middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '\\views');

// mount api
mountApi(app);

app.all('*', function(req, res) {
  res.render('index.' + process.env.NODE_ENV + '.ejs');
});

// configure for open shift
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// start server
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});
