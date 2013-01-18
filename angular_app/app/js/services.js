'use strict';

/* Services */

angular.module('timeseriesApp.services', ['ngResource']).
  factory('TimeseriesGET', function($resource){
    return $resource('/time_series?type=:type&start=:start&end=:end', {}, {
      query: {
        method: 'GET',
        //params: {
        //  type: 'MCL',
        //  start_date: '',
        //  end_date: ''
        //},
        //isArray: true
      }
    });
  });
