var Parse = require('parse').Parse;
// var ServerLocator = require('ServerLocator.js');
// var Lemma = require('Lemma.js');

var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser')

var application_id = "MNpQVek7y7MsaRLq7fKEpcZb9aNViTg22qPDyKil";
var javascript_key = "g3h61Nz2rhar2tib6JjVnf2oEAlwGH41yCY2p3M0";

// var lemma1 = new Lemma('nodeLemma', "Noam_Delta");

var deviceNames = ["Fridge", "AC", "Lights", "Washer", "Other"];


// lemma1.hears('Fridge', function(name, value) {
//   console.log(name + " : " + value);
//   var powerVal = parseInt(value);
//   savePower(powerVal, name);
// });
//// Connect via auto-discovery:
// new ServerLocator(lemma1).beginLocating();

Parse.initialize(application_id, javascript_key);

var ParsePower = Parse.Object.extend("Power2");

function savePower(powerLevel, sender, timestamp) {
  var pp = new ParsePower();

  pp.set("powerReading", powerLevel);
  pp.set("deviceType", sender);
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

var d = new Date();
var startTime = d.getTime();
var numberRounds = 0;
var offset = 0;
var MS_PER_MINUTE = 60000;


function populateFakeData(timeoffset) {
  console.log();

  for (var i = 0; i < 20 / deviceNames.length; i++) {

    var myStartDate = new Date(timeoffset - 5 * MS_PER_MINUTE * i);
    offset += 5 * MS_PER_MINUTE;
    console.log("Loading: " + myStartDate);
    console.log("Offset: " + offset);

    for (var id = 0; id < deviceNames.length; id++) {
      var fakeKWH = Math.random() * 0.2;
       savePower(fakeKWH, deviceNames[id], myStartDate);
    };

  }
}

function paseFakeData() {
  populateFakeData(startTime - offset);
  numberRounds++;
}

// setInterval(paseFakeData, 1000);

// paseFakeData();



function fakeDevices() {

  for (var i = 0; i < deviceNames.length; i++) {
    var fakeKWH = Math.random() * 0.2;
    console.log(+" " + fakeKWH);
    savePower(fakeKWH, deviceNames[i]);
  };
}
// fakeDevices();
// setInterval(fakeDevices, 1000 * 60 * 5);
