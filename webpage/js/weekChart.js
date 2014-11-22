var weekChartDim = {
	AMOffsetX: 15,
	PMOffsetX: (vizWidth / 25) * 14,
	AMPMOffsetY: 10,
	height: 180,
	paddingLeft: 0,
	paddingRight: 0,
	soFarNotificationHeight: 60,
	barMaxHeight: 10,
	numberBars: 8,
}
var weekChart;

var weekData = ['weekData'];

var xAxisDays = ['x'];


$.getJSON("weekData.json", function(json) {
	var maxVal = 0;
	for (var i = 0; i < weekChartDim.numberBars; i++) {
		weekData.push(json["week1"][i]);

		if (json["week1"][i] > maxVal) {
			maxVal = json["week1"][i];
		}
	};
	for (var i = 0; i < weekChartDim.numberBars; i++) {
		xAxisDays.push(i);
	};

	weekChartDim.barMaxHeight = maxVal * 1.2;
	setupWeekChart();
});

function setupWeekChart() {
	console.log("Setup week chart");

	weekChart = c3.generate({
		bindto: '#weekGraph',
		data: {
			x: 'x',
			xFormat: '%Y',
			columns: [
				weekData,
				xAxisDays,
			],
			type: 'bar',
			color: function(color, d) {
				// if (d.index < weekChartDim.numberBars - 1) {
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
			},
			onclick: function(d, i) {

				var weekIncrement = Math.floor(d.x / 7);

				var dayOfWeek = d.x - date.getDay();
				if (dayOfWeek < 0) {
					dayOfWeek += 7;
				}
				// updateLabels();
				setBarColors();
				$(i).css("fill", colors.selected);
				createPieChart("js/"+weekdayNamesShort[dayOfWeek]+".json",weekdayNamesLong[dayOfWeek], d.value);
			}
		},
		bar: {
			width: {
				ratio: 0.9
			}
		},
		size: {
			height: weekChartDim.height
		},
		padding: {
			left: weekChartDim.paddingLeft,
			right: weekChartDim.paddingRight,
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
					format: function(v) {
						var weekIncrement = Math.floor(v / 7);

						var dayOfWeek = v - date.getDay();
						if (dayOfWeek < 0) {
							dayOfWeek += 7;
						}
						return weekdayNamesShort[dayOfWeek];
					},
				}
			},
			y: {
				max: weekChartDim.barMaxHeight,
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
			duration: 10
		},
		interaction: {
			enabled: true
		},
		tooltip: {
			show: false
		},


	});
	var oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
	$("#weekDateLabel").html(oneWeekAgo.getDate() + " " + monthNames[oneWeekAgo.getMonth()] + " - " + date.getDate() + " " + monthNames[date.getMonth()]);


}
$(document).ready(function() {
	$('.c3-chart-text').currency();
	$("#testImage").click(function() {
		console.log(this);
		console.log(d3.mouse());
	});
});

/*
,
			onclick: function(d, i) {

				var weekIncrement = Math.floor(d.x / 7);

				var dayOfWeek = d.x - date.getDay();
				if (dayOfWeek < 0) {
					dayOfWeek += 7;
				}
				updateLabels(weekdayNamesLong[dayOfWeek], d.value);
				setBarColors();
				$(i).css("fill", colors.selected);
			}

			*/