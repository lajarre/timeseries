'use strict';

/* Directives */

angular.module('timeseriesApp.directives', [])
.directive('ghVisualization', function () {
  // Inspired from http://bl.ocks.org/3884955

  // Constants
  var margin = {top: 20, right: 120, bottom: 30, left: 80},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // Ranges
  var x = d3.time.scale()
  .range([0, width]);
  var y = d3.scale.linear()
  .range([height, 0]);

  // Scales and axes
  var color = d3.scale.category10(); // ?
  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  return {
    restrict: 'E', // 'E'lement
    scope: {
      val: '=',
    },
    link: function (scope, element, attrs) {

      // Set up initial svg object
      var svg = d3.select(element[0])
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Watch for changes in 'val', which is $scope.data, all the time (3rd
      // param set to true).
      scope.$watch('val', function (val) {

        // Clear the elements inside of the directive
        svg.selectAll('*').remove();

        // If 'val' is undefined
        if (!val) {
          return;
        }

        // line object
        var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d, i) { return x(val['Date'][i]); })
        .y(function(d) { return y(d); });

        // Dates
        var dates = val['Date'].map(function (d) {
          return new Date(parseInt(d));
        });

        // Names of the series
        var val_keys = (function () {
          var r = [];
          for (var i = 0, l = val._keys.length; i < l; ++i) {
            if (val._keys[i].selected)
              r.push(val._keys[i].name);
          }
          return r;
        })();
        var nb_keys = val_keys.length;

        // Domains
        color.domain(val_keys);
        x.domain(d3.extent(dates));
        y.domain(
          (function() {
          var min = Infinity,
          max = 0;
          for (var i = 0; i < nb_keys; ++i) {
            min = Math.min(min, d3.min(val[val_keys[i]]));
            max = Math.max(max, d3.max(val[val_keys[i]]));
          }
          return [min, max];
        })()
        );

        // SVG

        // x axis
        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis);

        // y axis
        svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

        // svg elements per timeseries
        var quantity = svg.selectAll('quantity')
        .data(val_keys)
        .enter()
        .append('g')
        .attr('class', 'quantity');

        // The line
        quantity.append('path')
        .attr('class', 'line')
        .attr('d', function (d, i) { return line(val[val_keys[i]]); })
        .style('stroke', function(d, i) { return color(val_keys[i]); });

        // Text in the end of the line
        quantity.append('text')
        .datum(function(d, i) {
          return {name: val_keys[i], value: val[val_keys[i]][val._N - 1]};
        })
        .attr("transform", function(d) {
          return "translate(" +
            x(dates[val._N - 1]) + "," +
            y(val[d.name][val._N - 1]) + ")";
        })
        .attr('x', 3)
        .attr('dy', '.35em')
        .text(function (d) {
          var min = d3.min(d.value),
              max = d3.max(d.value),
              mean = d3.mean(d.value);
          return d.name;
        });

      }, true);
    }
  }
});
