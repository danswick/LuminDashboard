var monthChartDim = {
	AMOffsetX: 15,
	PMOffsetX: (vizWidth / 25) * 14,
	AMPMOffsetY: 10,
	height: 180,
	paddingLeft: 0,
	paddingRight: 0,
	soFarNotificationHeight: 60,
	barMaxHeight: 10,
	numberBars: 5,
	barWidth: 0.9,
}
var monthChart;

var monthData = ['monthData'];

var xAxisMonths = ['x'];


$.getJSON("monthData.json", function(json) {
	var maxVal = 0;
	for (var i = 0; i < monthChartDim.numberBars; i++) {
		monthData.push(json["months"][i]);
		if (json["months"][i] > maxVal) {
			maxVal = json["months"][i];
		}
	};
	for (var i = 0; i < monthChartDim.numberBars; i++) {
		xAxisMonths.push(date.getMonth() - i);
	};
	console.log(xAxisMonths);
	monthChartDim.barMaxHeight = maxVal * 1.2;
	setupMonthChart();
	// setTimeout(setBarColors, 100);

});

function setupMonthChart() {
	console.log("Setup month chart");
	monthChart = c3.generate({
		bindto: '#monthGraph',
		data: {
			x: 'x',
			columns: [
				monthData,
				xAxisMonths,
			],
			type: 'bar',
			color: function(color, d) {
				// if (d.index < monthChartDim.numberBars - 1) {
				// 	return colors.secondary;
				// } else {
				// 	return colors.main;
				// }
				return colors.third;
			},
			labels: {
				format: function(v) {
					return floatToCurrency(v);
				},
				fill: "#ff00ff",
			},
			onclick: function(d, i) {
				// console.log("onclick", d, i);
				// updateLabels();
				setBarColors();
				$(i).css("fill", colors.selected);
				createPieChart("js/" + monthNames[d.x] + ".json",monthNamesLong[d.x], d.value);

			}
		},
		bar: {
			width: {
				ratio: monthChartDim.barWidth
			}
		},
		size: {
			height: monthChartDim.height
		},
		padding: {
			left: monthChartDim.paddingLeft,
			right: monthChartDim.paddingRight,
		},
		legend: {
			show: false
		},
		axis: {
			x: {
				padding: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0.5
				},
				tick: {
					show: false,
					centered: true,
					format: function(v) {
						return monthNames[v];
					},
				}
			},
			y: {
				max: monthChartDim.barMaxHeight,
				show: false,
				padding: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0
				}
			},
		},
		transition: {
			show: false,
			duration: 1,
		},
		interaction: {
			enabled: true
		},
		tooltip: {
			show: false
		}
	});
	var oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
	$("#monthDateLabel").html(monthNames[date.getMonth() - 3] + " - " + monthNames[date.getMonth()]);
}



function setBarColors() {

	$(".c3-bar").css("fill", colors.third);

}
// ugly hack to get around the fade in the bars that sets the color
// 

$(document).ready(function() {
	$('.c3-chart-text').currency();

});