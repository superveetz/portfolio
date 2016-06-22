var apiUrl = '/api';
var emailRoutes = require('./emails');

module.exports = function (app) {
  
  app.use(apiUrl, emailRoutes);

};
