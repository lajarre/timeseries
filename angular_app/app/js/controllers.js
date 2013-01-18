'use strict';

/* Controllers */


function GraphCtrl ($scope, $http, TimeseriesGET) {

  var checkData = function (data) {
    // Get 'date' column
    //Bug with the following code: "property is undefined"
    //var date_property = '';
    //for (property in data) {
    //  console.log(property);
    //  if (property.toLowerCase() == 'date')
    //    date_property = property;
    //}
    //if (date_property == '')
    //  return false;
    // XXX We could do some more inconsistency checking
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
        $scope.data =  data;
        // Clear the error messages
        $scope.error = '';
      }
      else
        $scope.error = "Data error: data not in the format {'date': [], 'header1': [], ...}";
    }, function (data, status) {
      console.log(data);
      $scope.error = 'Fetch error: ' + status;
    });
  };

  // Get the timeseries TODO
  //$scope.GETTimeseries('MCL', 1356994800000, 1358636400000);
  $scope.fetchTimeseries = function () {
    GETTimeseries($scope.type,
      Date.parse($scope.start_date),
      Date.parse($scope.end_date)
    );
  };
        
}
GraphCtrl.$inject = ['$scope', '$http', 'TimeseriesGET'];
