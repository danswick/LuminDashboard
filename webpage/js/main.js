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
PIE CHART
below 
========================================
*/

var cDim = {
	height: vizWidth / 1.5,
	width: vizWidth - 10,
	innerRadius: vizWidth * 0.22,
	outerRadius: vizWidth * 0.24,
	labelRadius: vizWidth * 0.29,
	leftLabelX: -vizWidth * 0.3,
	rightLabelX: vizWidth * 0.29,
	labelPadding: 5,
	labelOffsetY: 7,
}
var pieCenterLabel, pieCenterMoney;

// var color = d3.scale.ordinal()
// 	.range(["#00A8AB", "#C25700", "#787878", "#D88D2A", "#0071AD"]);

var arc = d3.svg.arc()
	.outerRadius(cDim.outerRadius)
	.innerRadius(cDim.innerRadius);

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var centerLabelAdded = false;


function createPieChart(jsonFile, label, money) {

	// clear out the previous pie chart if it exists
	var myNode = document.getElementById("pieChart");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	var svg = d3.select("#pieChart").append("svg")
		.attr("width", cDim.width)
		.attr("height", cDim.height)
		.append("g")
		.attr("transform", "translate(" + cDim.width / 2 + "," + cDim.height / 2 + ")");
	console.log("Loading file: " + jsonFile);


	d3.json(jsonFile, function(error, data) {

		data.forEach(function(d) {
			// console.log(d.name);
			// console.log(d.value);
			// console.log(d.color);
		});


		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc")
			.attr("id", function(d) {
				return "id_" + d.data.name;
			});


		g.append("line")
			.attr({
				x1: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					x = Math.cos(midAngle) * cDim.labelRadius;
					sign = (x > 0) ? 1 : -1
					labelX = x + (5 * sign)
					return labelX;
				},
				y1: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					y = Math.sin(midAngle) * cDim.labelRadius;
					return y;
				},
				x2: function(d, i) {
					return arc.centroid(d)[0];
				},
				y2: function(d, i) {
					return arc.centroid(d)[1];
				}

			})
			.attr("stroke", "#e6e6e6")
			.attr("stroke-width", "1");

		g.append("line")
			.attr({
				x1: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					x = Math.cos(midAngle) * cDim.labelRadius;
					sign = (x > 0) ? 1 : -1
					labelX = x + (5 * sign)
					return labelX;
				},
				y1: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					y = Math.sin(midAngle) * cDim.labelRadius;
					return y;
				},
				x2: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					x = Math.cos(midAngle) * cDim.labelRadius;
					sign = (x > 0) ? 1 : -1
					labelX = x + (5 * sign)
					if (labelX > 0) {
						return cDim.rightLabelX - cDim.labelPadding;
					} else {
						return cDim.leftLabelX + cDim.labelPadding;
					}
				},
				y2: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					y = Math.sin(midAngle) * cDim.labelRadius;
					return y;
				}

			})
			.attr("stroke", "#e6e6e6")
			.attr("stroke-width", "1");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) {
				return d.data.color
			});

		g.append("text")
			.attr("dy", ".35em")
			.style("text-anchor", function(d, i) {
				centroid = arc.centroid(d);
				midAngle = Math.atan2(centroid[1], centroid[0]);
				x = Math.cos(midAngle) * cDim.labelRadius;
				sign = (x > 0) ? 1 : -1
				labelX = x + (5 * sign)
				if (labelX > 0) {
					return "start";
				} else {
					return "end";
				}
			})
			.style("fill", function(d) {
				return d.data.color;
			})
			.attr({
				x: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					x = Math.cos(midAngle) * cDim.labelRadius;
					sign = (x > 0) ? 1 : -1
					labelX = x + (5 * sign)
					if (labelX > 0) {
						return cDim.rightLabelX;
					} else {
						return cDim.leftLabelX;
					}
				},
				y: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					y = Math.sin(midAngle) * cDim.labelRadius;
					return y + cDim.labelOffsetY;
				},
				'class': 'label-text-center-demi'
			})
			.text(function(d) {
				var moneyFloat = parseFloat(d.value);
				return floatToCurrency(moneyFloat);

			});

		g.append("text")
			.attr("dy", ".35em")
			.style("text-anchor", function(d, i) {
				centroid = arc.centroid(d);
				midAngle = Math.atan2(centroid[1], centroid[0]);
				x = Math.cos(midAngle) * cDim.labelRadius;
				sign = (x > 0) ? 1 : -1
				labelX = x + (5 * sign)
				if (labelX > 0) {
					return "start";
				} else {
					return "end";
				}
			})
			.style("fill", function(d) {
				return d.data.color;
			})
			.attr({
				x: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					x = Math.cos(midAngle) * cDim.labelRadius;
					sign = (x > 0) ? 1 : -1
					labelX = x + (5 * sign)
					if (labelX > 0) {
						return cDim.rightLabelX;
					} else {
						return cDim.leftLabelX;
					}
				},
				y: function(d, i) {
					centroid = arc.centroid(d);
					midAngle = Math.atan2(centroid[1], centroid[0]);
					y = Math.sin(midAngle) * cDim.labelRadius;
					return y - cDim.labelOffsetY;
				},
				'class': 'label-text'
			})
			.text(function(d) {
				return d.data.name;
			});


	});


	$("#pieChartLabel").text("Where your Money went");
	// add in the total in the middle
	pieCenterLabel = svg.append("text")
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.style('fill', colors.secondary)
		.attr({
			'x': 0,
			'y': -cDim.labelOffsetY,
			'class': 'label-text-center',
		})
		.text(function(d) {
			return label;
		});
	pieCenterMoney = svg.append("text")
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.style('fill', colors.secondary)
		.attr({
			'x': 0,
			'y': cDim.labelOffsetY,
			'class': 'label-text-center-demi',
		})
		.text(function(d) {
			var moneyFloat = parseFloat(money);
			return floatToCurrency(moneyFloat);
		});
}

// CURRENTLY NOT WORKING

function updatePieChart(jsonFile) {
}

createPieChart("js/data.json", "Total:", getDayTotal());
setTimeout(function() {
	console.log("timner up");
	createPieChart("js/data2.json");
}, 4000)


function updateLabels(label, money) {
	console.log(label + ":" + money);
	pieCenterLabel[0][0].innerHTML = label;
	pieCenterMoney[0][0].innerHTML = floatToCurrency(money);
	console.log(pieCenterLabel[0][0].innerHTML);
}




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





/* 
========================================
LINE CHART
below 
========================================
*/

$(document).ready(function() {
    $("#dayDateLabel").html( monthNamesLong[date.getMonth()] + " " +date.getDate());

  $("#soFarHighlight").css("top", $("#dayGraph").offset().top - dayChartDim.soFarNotificationHeight);
  $("#soFarHighlight").css("left", $("#dayGraph").offset().left);
});

var dayChartDim = {
  AMOffsetX: 15,
  PMOffsetX: (vizWidth / 25) * 14,
  AMPMOffsetY: 10,
  height: 140,
  paddingLeft: 10,
  paddingRight: 10,
  soFarNotificationHeight: 60,
}

var svgAMPM = d3.select("#dayGraphAMPM").append("svg")
  .attr("width", vizWidth)
  .attr("height", 20);

svgAMPM.append("text")
  .style("text-anchor", "middle")
  .style('fill', colors.secondary)
  .attr({
    'x': dayChartDim.AMOffsetX,
    'y': dayChartDim.AMPMOffsetY,
    'class': 'label-text-center',
  })
  .text(function(d) {
    return "AM";
  });

svgAMPM.append("text")
  .style("text-anchor", "middle")
  .style('fill', colors.secondary)
  .attr({
    'x': dayChartDim.PMOffsetX,
    'y': dayChartDim.AMPMOffsetY,
    'class': 'label-text-center',
  })
  .text(function(d) {
    return "PM";
  });



// generate the dataset for the x axis,
// should be pulled from the actual dataset instead
var xAxisTime = ['x'];
for (var i = 0; i < 24; i++) {
  xAxisTime.push(new Date(2014, 10, 3, i, 44, 1, 0))
};
var dayGraphData = ['data1'];
for (var i = 0; i < new Date().getHours() + 1; i++) {
  dayGraphData.push(Math.random(100));
};
for (var i = 0; i < 24 - new Date().getHours() + 1; i++) {
  dayGraphData.push(null);
};

var chart1 = c3.generate({
  bindto: '#dayGraph',
  size: {
    height: dayChartDim.height
  },
  padding: {
    left: dayChartDim.paddingLeft,
    right: dayChartDim.paddingRight,
  },
  data: {
    x: 'x',
    xFormat: '%Y',
    columns: [
      dayGraphData,
      xAxisTime,
    ],
    type: 'area',
    colors: {
      data1: '#E6E6E6'
    },
  },
  point: {
    r: 0
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
        right: 0
      },
      type: 'timeseries',
      // if true, treat x value as localtime (Default)
      // if false, convert to UTC internally
      localtime: true,
      tick: {
        format: function(x) {
          var hours = x.getHours();
          var minutes = x.getMinutes();
          var ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0' + minutes : minutes;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return hours;
        },
        count: 24,
      }
    },
    y: {
      show: false,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    }
  }
});

var svgSoFar = d3.select("#soFarHighlight").append("svg")
  .attr("width", vizWidth)
  .attr("height", dayChartDim.height + dayChartDim.soFarNotificationHeight);



// NEED TO BE FIXED TO ALIGN THE SO FAR 
// LOOK AT THE soFarDim variables to align the line
// var percentageOffDayPassed = ((new Date().getHours() + 1) / 24 + new Date().getMinutes() / (60 * 24));
var percentageOffDayPassed = ((new Date().getHours() + 1) / 24);
var soFarXPosition = (vizWidth - dayChartDim.paddingLeft) * percentageOffDayPassed;

var soFarDim = {
  x: soFarXPosition,
  yTop: dayChartDim.soFarNotificationHeight,
  yBottom: dayChartDim.height - 30 + dayChartDim.soFarNotificationHeight,
  topOffset: 0,
  textLineHeight: 14,
  textLineOffset: 10,
}

svgSoFar.append("line")
  .attr({
    x1: function(d, i) {

      return soFarDim.x;
    },
    y1: function(d, i) {

      return soFarDim.yTop;
    },
    x2: function(d, i) {
      return soFarDim.x;
    },
    y2: function(d, i) {
      return soFarDim.yBottom;
    }
  })
  .attr("stroke", "#648C3D")
  .attr("stroke-width", "2");


svgSoFar.append("text")
  .style("text-anchor", "middle")
  .style('fill', "#648C3D")
  .attr({
    'x': soFarDim.x,
    'y': soFarDim.yTop - (soFarDim.textLineHeight * 2) - soFarDim.textLineOffset,
    'class': 'soFar-Label',
  })
  .text(function(d) {
    return "You've";
  });
svgSoFar.append("text")
  .style("text-anchor", "middle")
  .style('fill', "#648C3D")
  .attr({
    'x': soFarDim.x,
    'y': soFarDim.yTop - (soFarDim.textLineHeight * 1) - soFarDim.textLineOffset,
    'class': 'soFar-Label',
  })
  .text(function(d) {
    return "spent:";
  });
svgSoFar.append("text")
  .style("text-anchor", "middle")
  .style('fill', "#648C3D")
  .attr({
    'x': soFarDim.x,
    'y': soFarDim.yTop - (soFarDim.textLineHeight * 0) - soFarDim.textLineOffset,
    'class': 'soFar-Label number',
  })
  .text(function(d) {
    return "$" + getDayTotal();
  });




/* 
========================================
WEEK CHART
below 
========================================
*/

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




/* 
========================================
MONTH CHART
below 
========================================
*/

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



/* 
========================================
CALENDAR CHART
below 
========================================
*/


var calDim = {
	boxWidth: vizWidth * 0.1,
	boxHeight: vizWidth * 0.1,
	leftPadding: vizWidth * 0.15,
	topPadding:0,
	boxRadius: 0,
	boxPadding: 2,
	passedColor: "#e6e6e6",
	upcomingColor: "#ffffff",
	todaysColor: "#648C3C",
	lastDayColor: "#D88D2A",
	labelColor: "#ffffff",
	labelSpacing: vizWidth * 0.02,
}

$("#calendarChart").css("height", (calDim.boxHeight+calDim.boxPadding)*7+calDim.boxHeight/2+"px");
;
var calendarSVG = d3.select("#calendarChart").append("svg")
	.attr("width", vizWidth)
	.attr("height", $("#calendarChart").css("height"));

function drawCalendar() {

	var calendarDate = new Date();

	var firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
	var lastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);

	var numDays = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0).getDate();
	var daysPerWeek = 7;
	var startDay = date.getDay() +1;
	var boxController = {
		y: 0,
		x: startDay
	};
	var daysPassed = calendarDate.getDate() + 5;
	var boxColor = calDim.passedColor;


	for (var i = 0; i < numDays; i++) {

		if (boxController.x % daysPerWeek == 0) {
			boxController.x = 0;
			boxController.y++;
		}

		var rect = calendarSVG.append("rect")
			.attr("rx", calDim.boxRadius)
			.attr("ry", calDim.boxRadius)
			.attr("x", (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding)
			.attr("y", (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding)
			.attr("width", calDim.boxWidth)
			.attr("height", calDim.boxHeight)
			.style("fill", boxColor);

		if (i == daysPassed - 1) {
			rect.style("fill", calDim.todaysColor);

			var todaysSpeachBubble = {
				x: (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
				y: (calDim.boxHeight + calDim.boxPadding) * boxController.y - (calDim.boxHeight+calDim.boxPadding)+calDim.topPadding,
				textPadding: 5,

			}

			calendarSVG.append("path").attr("d", "M48,34.401h-92c-11.046,0-21-7.954-21-19v-39c0-11.046,9.954-21,21-21h35.342l10.45-9.803l10.45,9.803H48c11.046,0,19,9.954,19,21v39C67,26.447,59.046,34.401,48,34.401z")
				.attr("stroke", calDim.todaysColor)
				.attr("fill", "#ffffff")
				.attr("transform", "translate(" + todaysSpeachBubble.x + "," + todaysSpeachBubble.y + ")" + "rotate(180)" + "scale(0.5)")
				.attr("stroke-width", "2");

			calendarSVG.append("text")
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.style('fill', calDim.todaysColor)
				.attr({
					'x': todaysSpeachBubble.x,
					'y': todaysSpeachBubble.y - todaysSpeachBubble.textPadding,
					'class': 'label-text-center-calendar',
				})
				.text(function(d) {
					return "Spent:";
				});

			calendarSVG.append("text")
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.style('fill', calDim.todaysColor)
				.attr({
					'x': todaysSpeachBubble.x,
					'y': todaysSpeachBubble.y + todaysSpeachBubble.textPadding + 5,
					'class': 'label-text-center-calendar-speechBubble',
				})
				.text(function(d) {
					return floatToCurrency(getBillSofar(date.getDay()));
				});


			calendarSVG.append("text")
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.style('fill', calDim.labelColor)
				.attr({
					'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
					'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 - calDim.labelSpacing,
					'class': 'label-text-center-calendar',
				})
				.text(function(d) {
					return monthNames[date.getMonth()];
				});
			calendarSVG.append("text")
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.style('fill', calDim.labelColor)
				.attr({
					'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
					'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 + calDim.labelSpacing,
					'class': 'label-text-center-calendar',
				})
				.text(function(d) {
					return date.getDate();
				});
		}

		if (i >= daysPassed - 1) {
			if (i == numDays - 1) {
				rect.style("fill", calDim.lastDayColor);
				calendarSVG.append("text")
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.style('fill', calDim.lastDayColor)
					.attr({
						'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
						'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 + calDim.labelSpacing + 20,
						'class': 'label-text-center-calendar',
					})
					.text(function(d) {
						return "Forecast:";
					});

				calendarSVG.append("text")
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.style('fill', calDim.lastDayColor)
					.attr({
						'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
						'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 + calDim.labelSpacing + 35,
						'class': 'label-text-center-calendar-speechBubble',
					})
					.text(function(d) {
						return "$" + (getEstimatedBill());
					});
				calendarSVG.append("text")
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.style('fill', calDim.labelColor)
					.attr({
						'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
						'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 - calDim.labelSpacing,
						'class': 'label-text-center-calendar',
					})
					.text(function(d) {
						return monthNames[lastDay.getMonth() + 1];
					});
				calendarSVG.append("text")
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.style('fill', calDim.labelColor)
					.attr({
						'x': (calDim.boxWidth + calDim.boxPadding) * boxController.x + calDim.leftPadding + calDim.boxWidth / 2,
						'y': (calDim.boxHeight + calDim.boxPadding) * boxController.y + calDim.topPadding + calDim.boxHeight / 2 + calDim.labelSpacing,
						'class': 'label-text-center-calendar',
					})
					.text(function(d) {
						return lastDay.getDate();
					});
			} else {
				boxColor = calDim.upcomingColor;
				rect.style("stroke-width", 1)
					.style("stroke", "rgb(230,230,230)");
			}
		}

		boxController.x++;
	};
}

drawCalendar();



/* 
========================================
TABS
below 
========================================
*/

// $(".tab-center").css("border-radius","0");

// $(".tab-left").css("border-left","2px");
// $(".tab-left").css("border-right","0px");

// $(".tab-right").css("border-left","0");
// $(".tab-right").css("border-right","2px");





/* 
========================================
PARSE CHART
below 
========================================
*/

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

