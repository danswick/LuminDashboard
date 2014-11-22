var Parse = require('parse').Parse;
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser')

var application_id = "MNpQVek7y7MsaRLq7fKEpcZb9aNViTg22qPDyKil";
var javascript_key = "g3h61Nz2rhar2tib6JjVnf2oEAlwGH41yCY2p3M0";

// app.use(bodyParser);
app.use(bodyParser.urlencoded());

app.get('/', function(req, res) {
	console.log('GET /')
	var html = '<html><body><form method="post" action="">Name:<input type="text" name="name"><br>Power<input type="text" name="power"><br>Fraction<input type="text" name="fraction"><input type="submit" value="Submit" /></form>';
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end(html);
});

app.post('/', function(req, res) {
	console.log('POST /');
	console.dir(req.body);

	if (req.body.name != null && req.body.power != null && req.body.fraction != null) {
		console.log(req.body.name + " : " + req.body.power);
		var powerTotal = parseInt(req.body.power) + (parseInt(req.body.fraction) / 10000);
		console.log(powerTotal);
		savePower(powerTotal, req.body.name);
	}

	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end(req.body.name + " : " + req.body.power);
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log("Starting on port:" + port);


// PARSE CODE

var deviceNames = ["Fridge", "AC", "Lights", "Washer", "Other"];

Parse.initialize(application_id, javascript_key);

var ParsePower = Parse.Object.extend("Power2");

function savePower(powerLevel, sender, timestamp) {
	var pp = new ParsePower();

	pp.set("powerReading", powerLevel);
	pp.set("device_id", sender);
	if (timestamp != null) {
		pp.set("fakeTimestamp", timestamp);
	}
	pp.save(null, {
		success: function(powerObject) {
			// Execute any logic that should take place after the object is saved.
			console.log('New object created with objectId: ' + powerObject.id);
		},
		error: function(powerObject, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			console.log('Failed to create new object, with error code: ' + error.message);
		}
	});
}