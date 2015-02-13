function main() {
/* 
========================================
MONEY
below
========================================
*/

var vizWidth=$(window).width()*0.95;
$(".vizDivider").css("height",$(window).width()*0.025);

var date = new Date();

var colors = {
	main: "#6BA2B9",
	secondary: "#b3b3b3",
	third: "#E6E6E6",
	selected:"#6BA2B9",
};

function getDayTotal() {
	var total = (getMonthTotal() / daysInMonth(date.getMonth() + 1, date.getYear()));
	return total.toFixed(2);
}

function getWeekTotal() {
	var total = (getMonthTotal() / daysInMonth(date.getMonth() + 1, date.getYear())) * 7;
	return total.toFixed(2);
}

function getMonthTotal() {
	var supply = dashboardData[0].monthTotalKwh * dashboardData[0].electricSupplyCharge + dashboardData[0].monthTotalKwh * dashboardData[0].transmissionServicesCharge + dashboardData[0].purschasedElectricityAdjustment;
	var delivery = dashboardData[0].customerCharge + dashboardData[0].standardMeterCharge + dashboardData[0].monthTotalKwh * dashboardData[0].distributionFacilitiesCharge + dashboardData[0].monthTotalKwh * dashboardData[0].ILDistributionCharge;
	var taxesFees = dashboardData[0].monthTotalKwh * dashboardData[0].enviromentalCostRecoveryAdjustment + dashboardData[0].monthTotalKwh * dashboardData[0].energyEfficientProgram + dashboardData[0].franchiseCost + dashboardData[0].stateTax + dashboardData[0].municipalTax;
	var total = supply + delivery + taxesFees;
	return total.toFixed(2);
}

function getEstimatedBill(){
	var total=getMonthTotal()/10;
	var rounded=total.toFixed(0);
	return rounded*10;
}

function getBillSofar(numDays) {
	var total = (getMonthTotal() / daysInMonth(date.getMonth() + 1, date.getYear())) * numDays;
	return total.toFixed(2);
}


// helper functions

function floatToCurrency(number) {
	var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);

	var AmountWithCommas = number.toLocaleString();
	var arParts = String(AmountWithCommas).split(DecimalSeparator);
	var intPart = arParts[0];
	var decPart = (arParts.length > 1 ? arParts[1] : '');
	decPart = (decPart + '00').substr(0, 2);
	return '$' + intPart + DecimalSeparator + decPart;
}

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var monthNamesLong = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

var weekdayNamesShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var weekdayNamesLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];




/* 
========================================
FORECAST
below 
========================================
*/

var billSoFarValue = 60.34;
var billForecastValue = 100;

var progressBarPadding = (vizWidth - $("#forecast").width()) / 2;

var month = date.getMonth() + 1;
var currentDay = date.getDate();


var daysThisMonth = daysInMonth(date.getMonth() + 1, date.getYear());

var dayPosition = (currentDay / daysThisMonth) * $("#forecast").width();

console.log();
$("#forecastMonthLabel").text("This Month: $"+ (dashboardData[0].savingsGoal));

$("#forecastSoFarLabelValue").text(" $" + getBillSofar(date.getDay()));
$("#forecastTotalLabelValue").text("  $" + (dashboardData[0].savingsGoal - getBillSofar(date.getDay())));
$("#forecastProgressBar").css('width', getBillSofar(date.getDay()) / dashboardData[0].savingsGoal * 100 + '%').attr('aria-valuenow', getBillSofar(date.getDay()) / dashboardData[0].savingsGoal * 100);



}