define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var SummaryChart = function() {};

  SummaryChart.prototype = new Chart({});

  SummaryChart.prototype.constructor = SummaryChart

  SummaryChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height ||self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 100;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")

    self.x = x;
    self.xAxis = xAxis;

    self.svg.append("linearGradient").data([data])
        .attr("id", "arrow-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", x(xMin)).attr("y1", 0)
        // .attr("x2", function(d) { return x(d) }).attr("y2", 0)
        .attr("x2", function(d) { return x(xMax); }).attr("y2", 0)
      .selectAll("stop")
        .data([
          { offset: "0%", color: "#fff", opacity: 0 },
          { offset: "100%", color: "#fff", opacity: 1 }
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; })
        .attr("stop-opacity", function(d) { return d.opacity; });

    var bars = self.svg.selectAll(".bar")
        .data([data])

    bars.enter().append("polygon")
        .attr("class", "bar")
        .attr('fill', 'url(#arrow-gradient)')
        .attr('opacity', '0.6')
        .attr("points", function(d) { return [x(0)+" 0", x(d)+" 0", (x(d)+20)+" "+(self.height/2), x(d)+" "+self.height, x(0)+" "+self.height].join(", ") })

    bars.transition()
        .attr("points", function(d) { return [x(0)+" 0", x(d)+" 0", (x(d)+20)+" "+(self.height/2), x(d)+" "+self.height, x(0)+" "+self.height].join(", ") })


    var text = self.svg.selectAll(".background-text")
        .data([data])

    text.enter().append("text")
        .attr("class", "background-text")
        .attr("y", 44)

    text.transition()
        .attr("x", function(d) { return x(d / 2) })
        .text(function(d) { return (d + "% CO₂ Reduction") })

    self.svg.selectAll('.demarcation').remove();
    self.svg.append("rect")
      .attr({
        "class": "demarcation",
        "x" : x(80),
        "width" : x(20),
        "y" : 0,
        "height" : self.height,
        "fill": "rgba(255,255,255, 0.3)"
      });
  };

  return SummaryChart;
});

