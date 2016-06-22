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

app.listen(3000, function () {
  console.log('web server @ localhost:3000');
});
