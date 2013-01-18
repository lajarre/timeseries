'use strict';

/* Directives */


angular.module('timeseriesApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('ghVisualization', function () {
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

        scope.$watch('val', function (val, oldVal) {

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
          //var dateFormatter = d3.time.format("%b %d") ;
          var dates = val['Date'].map(function (d) {
            return new Date(parseInt(d));
            }
          );
          //var string_dates = val['Date'].map(function (d) {
          //  return dateFormatter(new Date(d));
          //});
          //console.log('string_dates'); 
          //console.log(string_dates); 

          // Domains
          var val_keys = d3.keys(val).filter(function(key) {
            // Pay attention to Date and other properties of the Angular
            // Resource object!
            return key !== "Date" && /^[a-zA-Z]\w*/.test(key);
          });
          var nb_keys = val_keys.length;
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
          console.log('domains:');
          console.log(x.domain());
          console.log(y.domain());

          // SVG
          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis);
          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
          var formatted_values = (function () {
            var r = [];
            for (var i = 0; i < nb_keys; ++i)
              // TODO Could be done withoud name key (refer to val_keys
              r.push({name: val_keys[i], values: val[val_keys[i]]});
            return r;
          })();
          var quantity = svg.selectAll('quantity')
            .data(formatted_values)
            .enter()
            .append('g')
            .attr('class', 'quantity');
          quantity.append('path')
            .attr('class', 'line')
            .attr('d', function (d) { return line(d.values); })
            .style('stroke', function(d) { return color(d.name); });
          //for (var i = 0; i < nb_keys; ++i) {
          //  quantity.append('path')
          //    .attr('class', 'line')
          //    .attr('d', function(d) { return val[val_keys[i]]; })
          //    .style('stroke', function(d) { return color(val_keys[i]); });
          //}
          quantity.append('text')
            .datum(function(d) { return {name: d.name, value: d.values[val._N - 1]}; })
            .attr("transform", function(d) {
              return "translate(" +
                x(dates[val._N - 1]) + "," +
              y(val[d.name][val._N - 1]) + ")";
            })
            .attr('x', 3)
            .attr('dy', '.35em')
            .text(function (d) { return d.name; });
        });
      }
    }
  });
