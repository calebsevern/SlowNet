
var bodyParser = require('body-parser');
var twilio = require('twilio');
var express = require('express');
var request = require('request');
var baudio = require('baudio');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var sys = require('sys')
var exec = require('child_process').exec;
var child;

function puts(error, stdout, stderr) {
  sys.puts(stdout);
}


app.post('/testing', function(req, res) {
  
  // console.log('-----------------------------');
  // console.log(req.body.Digits);
  
    
  if (twilio.validateExpressRequest(req, '004590a64e03f78e2d70d05aa2c3b847')) {
    
    var twiml = new twilio.TwimlResponse();
      
    var charArray = req.body.Digits.match(/.{1,3}/g);
    for(var i=0; i<charArray.length; i++) {
      charArray[i] = String.fromCharCode(charArray[i]);
    }
    var url = 'http://' + charArray.join('');  
    
    var url = 'http://severn.me/hi.txt';
    // Testing
    request(url, function (error, response, body) {
      
      var str = body;
      // console.log("body: " + body)
      //var str = "lorem ipsum dolor sit amet."
            
      // Convert body to bytes
      //var bytes = [];
      for (var i = 0; i < str.length; ++i) {
        // bytes.push(str.charCodeAt(i));
        var v = str.charCodeAt(i);
        if(v < 100) {
          v = "0" + v;
        }
        //console.log(v);
        twiml.play({digits: v});
      }
      
      res.type('text/xml');
      res.send(twiml.toString());
    });
  }
});



// Create a route to respond to a call
app.post('/respondToVoiceCall', function(req, res) {
  
  
  if (twilio.validateExpressRequest(req, '004590a64e03f78e2d70d05aa2c3b847')) {
    
    
      var twiml = new twilio.TwimlResponse();
      twiml.gather({
        action: "http://severn.me:3464/testing",
        timeout: 7,
        finishOnKey:'*'
      }, function(node) {
          //node.say('Press 1 for customer service');
      });

      res.type('text/xml');
      res.send(twiml.toString());
  }
});




app.listen(3464);
