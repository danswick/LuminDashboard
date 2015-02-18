var billSoFarValue = 60.34;
var billForecastValue = 100;

// var forecastSVG = d3.select("#forecastToday").append("svg")
// 	.attr("width", vizWidth)
// 	.attr("height", 40);
var progressBarPadding = (vizWidth - $("#forecast").width()) / 2;

var month = date.getMonth() + 1;
var currentDay = date.getDate();


var daysThisMonth = daysInMonth(date.getMonth() + 1, date.getYear());

var dayPosition = (currentDay / daysThisMonth) * $("#forecast").width();

// set the header to todays month and set the forecast values
// $("#forecastHeader").text(monthNamesLong[month - 1] + " Bill Forecast");
console.log();
$("#forecastMonthLabel").text("This Month: $"+ (dashboardData[0].savingsGoal));

$("#forecastSoFarLabelValue").text(" $" + getBillSofar(date.getDay()));
$("#forecastTotalLabelValue").text("  $" + (dashboardData[0].savingsGoal - getBillSofar(date.getDay())));
$("#forecastProgressBar").css('width', getBillSofar(date.getDay()) / dashboardData[0].savingsGoal * 100 + '%').attr('aria-valuenow', getBillSofar(date.getDay()) / dashboardData[0].savingsGoal * 100);

// forecastSVG.append("line")
// 	.attr({
// 		x1: function(d, i) {

// 			return dayPosition + progressBarPadding;
// 		},
// 		y1: function(d, i) {

// 			return 0;
// 		},
// 		x2: function(d, i) {
// 			return dayPosition + progressBarPadding;
// 		},
// 		y2: function(d, i) {
// 			return 10;
// 		}
// 	})
// 	.attr("stroke", colors.secondary)
// 	.attr("stroke-width", "1");

// forecastSVG.append("text")
// 	.attr("dy", ".35em")
// 	.style("text-anchor", "middle")
// 	.style('fill',colors.secondary)
// 	.attr({
// 		'x': dayPosition + progressBarPadding,
// 		'y': 20,
// 		'class': 'label-text-center',
// 	})
// 	.text(function(d) {
// 		return "Today";
// 	});
// forecastSVG.append("text")
// 	.attr("dy", ".35em")
// 	.style("text-anchor", "middle")
// 	.style('fill', colors.secondary)
// 	.attr({
// 		'x': dayPosition + progressBarPadding,
// 		'y': 35,
// 		'class': 'label-text-center-goal-date',
// 	})
// 	.text(function(d) {
// 		return monthNames[date.getMonth()]+" " +date.getDate(); 
// 	});