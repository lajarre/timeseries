'use strict';

/* Services */

angular.module('timeseriesApp.services', ['ngResource'])
  .factory('TimeseriesGET', function($resource) {
    return $resource('/time_series?type=:type&start=:start&end=:end', {}, {
      query: {
        method: 'GET',
      }
    });
  })
  .factory('ChoicesGET', function ($resource) {
    return $resource('/time_series_choices', {}, {
      query: {
        method: 'GET',
      }
    });
  });
