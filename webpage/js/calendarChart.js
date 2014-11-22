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