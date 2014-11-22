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