var bodyParser = require('body-parser');
var twilio = require('twilio');
var express = require('express');
var request = require('request');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/testing', function(req, res) {
 
  if (twilio.validateExpressRequest(req, '004590a64e03f78e2d70d05aa2c3b847')) {
    var twiml = new twilio.TwimlResponse();
    var charArray = req.body.Digits.match(/.{1,3}/g);
    
    for(var i=0; i<charArray.length; i++) {
      charArray[i] = String.fromCharCode(charArray[i]);
    }
    
    var url = 'http://' + charArray.join('');  
    request(url, function (error, response, body) {
      var str = body;
      for (var i = 0; i < str.length; ++i) {
        var v = str.charCodeAt(i);
        if(v < 100) {
          v = "0" + v;
        }
        twiml.play({digits: v});
      }
      
      res.type('text/xml');
      res.send(twiml.toString());
    });
  }
});



app.post('/respondToVoiceCall', function(req, res) {
  if (twilio.validateExpressRequest(req, '004590a64e03f78e2d70d05aa2c3b847')) {
    
      var twiml = new twilio.TwimlResponse();
      twiml.gather({
        action: "http://severn.me:3464/testing",
        timeout: 7,
        finishOnKey:'*'
      }, function(node) {
      });

      res.type('text/xml');
      res.send(twiml.toString());
  }
});


app.listen(3464);
