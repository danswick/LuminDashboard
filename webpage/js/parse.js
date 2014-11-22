Parse.initialize("MNpQVek7y7MsaRLq7fKEpcZb9aNViTg22qPDyKil", "g3h61Nz2rhar2tib6JjVnf2oEAlwGH41yCY2p3M0");

var PowerData = Parse.Object.extend("Power2");



function findDeviceDateRange(deviceType, startDate, endDate) {
	var query = new Parse.Query(PowerData);

	console.log("Type: " + deviceType);
	console.log("Start: " + new Date(startDate));
	console.log("End: " + endDate);

	 query.limit(1000);
	query.equalTo("deviceType", deviceType);
	query.lessThan("createdAt", endDate);
	query.greaterThan("createdAt", new Date(startDate));

	 query.find({
		success: function(object) {
			// Successfully retrieved the object.
			console.log(object.id);

		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}


// findDeviceDateRange("AC", new Date().setMonth(date.getMonth() - 1), new Date());
// findDeviceDateRange("AC", new Date().setDate(date.getDate() - 2), new Date());

