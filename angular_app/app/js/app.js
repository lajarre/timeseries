'use strict';


// Declare app level module which depends on filters, and services
angular.module('timeseriesApp', ['timeseriesApp.filters', 'timeseriesApp.services', 'timeseriesApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/graph', {templateUrl: 'partials/graph.html', controller: GraphCtrl});
    $routeProvider.otherwise({redirectTo: '/graph'});
  }]);


