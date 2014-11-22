var _ = require("underscore");
var Parse = require("parse").Parse;
var application_id = "MNpQVek7y7MsaRLq7fKEpcZb9aNViTg22qPDyKil";
var javascript_key = "g3h61Nz2rhar2tib6JjVnf2oEAlwGH41yCY2p3M0";

Parse.initialize(application_id, javascript_key);

var ParsePower = Parse.Object.extend("DailyPower");


var date = new Date();
var currentCount = 0;
var averagePower = 0;
var totalPower = 0;

var query = new Parse.Query("Power2");

var deviceType = "AC";
var startDate = new Date().setDate(date.getDate() - 4);
var endDate = new Date().setDate(date.getDate() - 3);

var dateOffset =

var start = new Date();
start.setHours(0,0,0,0);

var end = new Date();
end.setHours(23,59,59,999);


console.log("Type: " + deviceType);
console.log("Start: " + new Date(startDate));
console.log("End: " + new Date(endDate));

query.equalTo("deviceType", deviceType);
query.greaterThan("fakeTimestamp", new Date(startDate));
query.lessThan("fakeTimestamp", new Date(endDate));

return query.each(function(event) {
	console.log("Retrievd objects: " + currentCount++);
	 console.log(event.attributes.fakeTimestamp);
	var power = event.attributes.powerReading;
	totalPower += power;

}).then(function() {
	console.log("Finished");
	console.log("Average: " + totalPower / currentCount);
	console.log();
});

function saveDailyAverage(dateObject, _averagePower) {

	var pp = new ParsePower();

	pp.set("averagePower", _averagePower);
	pp.set("dayDate", dateObject);

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