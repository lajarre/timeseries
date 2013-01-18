'use strict';

/* Directives */


angular.module('timeseriesApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('ghVisualization', function () {

    // Constants
    var margin = 20,
    width = 960,
    height = 500 - .5 - margin,
    color = d3.interpolateRgb("#f77", "#77f");

    return {
      restrict: 'E', // 'E'lement
      //scope: {
      //  val: '=',
      //  grouped: '='
      //},
      link: function (scope, element, attrs) {

        // set up initial svg object
        var vis = d3.select(element[0])
          .append("svg")
          .attr("width", width)
          .attr("height", height + margin + 100);

        scope.$watch('val', function (newVal, oldVal) {

          // clear the elements inside of the directive
          vis.selectAll('*').remove();

          // if 'val' is undefined, exit
          if (!newVal) {
            return;
          }
        });
      }
    }
  });
