'use strict';

/* Controllers */


function GraphCtrl ($scope, $http, TimeseriesGET) {

  var checkData = function (data) {
    // XXX We could do some inconsistency checking
    //// Get 'date' column
    //var date_property = '';
    //for (var property in data) {
    //  console.log(property);
    //  if (property.toLowerCase() === 'date')
    //    date_property = property;
    //}
    //if (date_property == '')
    //  return false;
    if (typeof data.Date === 'undefined')
      return false;

    // Store relevant values in data for later access
    data._N = data.Date.length;
    //data._date_property = date_property;
    var date0 = new Date(data.Date[data._N - 1]);
    var dateN = new Date(data.Date[0]);
    data._days = Math.floor((dateN - date0) / 86400000) + 1;
    
    return true;
  };
  
  var GETTimeseries = function (type, start_date, end_date) {

    TimeseriesGET.get({
      type: type, start: start_date, end: end_date
    }, function (data) {
      console.log('data:');
      console.log(data);
      if (checkData(data)) {
        $scope.data = data;
        // Clear the error messages
        $scope.error = '';
      }
      else {
        $scope.error = "Bad response from the server.";
        //$scope.error = "Data error: data not in the format {'Date': [], 'header1': [], ...}";
      }
    }, function (data, status) {
      console.log(data);
      $scope.error = 'Fetch error: ' + status;
    });
  };

  $scope.fetchTimeseries = function () {
    GETTimeseries($scope.type,
      Date.parse($scope.start_date),
      Date.parse($scope.end_date)
    );
  };
  
  // Let's do it!
  // Defaults
  $scope.type = 'MCL';
  $scope.start_date = '1/1/2013';
  $scope.end_date = '1/13/2013';

  $scope.fetchTimeseries();
        
}
GraphCtrl.$inject = ['$scope', '$http', 'TimeseriesGET'];
