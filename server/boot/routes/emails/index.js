var express = require('express');
var router = express.Router();

var nodemailer = require("nodemailer");

router.post('/send-email', function (req, res) {

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport('smtps://superveetz%40gmail.com:Monsoon321@smtp.gmail.com');

  var mailOptions = {
    from: '"' + req.body.name + '" <' + req.body.email + '>', // sender address
    to: 'alexdiv87@hotmail.com', // list of receivers
    subject: 'Email from alexdivito.ca', // Subject line
    text: "Make sure to manually enter their email address: " + req.body.email + "\n\n" +
          "Name: " + req.body.name + "\n\n" +
          "Message: " + req.body.message // plaintext body
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.log(err);
      return new Error(err);
    } else {
      console.log('Message sent: ' + info.response);
      return res.send({
        emailSent: true
      });
    }
  });

});

module.exports = router;
