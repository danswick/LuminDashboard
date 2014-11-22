var vizWidth=$(window).width()*0.95;
$(".vizDivider").css("height",$(window).width()*0.025);

var date = new Date();

var colors = {
	main: "#6BA2B9",
	secondary: "#b3b3b3",
	third: "#E6E6E6",
	selected:"#6BA2B9",
};

var bill = {
	electricSupplyCharge: 0.06473,
	transmissionServicesCharge: 0.01014,
	purschasedElectricityAdjustment: -1.17,

	customerCharge: 8.38,
	standardMeterCharge: 3.41,
	distributionFacilitiesCharge: 0.03172,
	ILDistributionCharge: 0.00118,

	enviromentalCostRecoveryAdjustment: 0.00017,
	energyEfficientProgram: 0.00223,
	franchiseCost: 1.23,
	stateTax: 0.77,
	municipalTax: 1.46,

	monthTotalKwh: 360,
	savingsGoal:70,
}

	function getDayTotal() {
		var total = (getMonthTotal() / daysInMonth(date.getMonth() + 1, date.getYear()));
		return total.toFixed(2);
	}

	function getWeekTotal() {
		var total = (getMonthTotal() / daysInMonth(date.getMonth() + 1, date.getYear())) * 7;
		return total.toFixed(2);
	}

	function getMonthTotal() {
		var supply = bill.monthTotalKwh * bill.electricSupplyCharge + bill.monthTotalKwh * bill.transmissionServicesCharge + bill.purschasedElectricityAdjustment;
		var delivery = bill.customerCharge + bill.standardMeterCharge + bill.monthTotalKwh * bill.distributionFacilitiesCharge + bill.monthTotalKwh * bill.ILDistributionCharge;
		var taxesFees = bill.monthTotalKwh * bill.enviromentalCostRecoveryAdjustment + bill.monthTotalKwh * bill.energyEfficientProgram + bill.franchiseCost + bill.stateTax + bill.municipalTax;
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