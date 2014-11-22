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

	// d3.json(jsonFile, function(error, data) {

	// 	data.forEach(function(d) {
	// 		console.log(d.name);
	// 		console.log(d.value);
	// 		console.log(d.color);
	// 	});

	// 	var svg = d3.select("pieChart").transition();
	// 	svg.select(".path") // change the line
	// 	.duration(750)
	// 		.data(pie(data))
	// 		.attr("d", arc);

	// });
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