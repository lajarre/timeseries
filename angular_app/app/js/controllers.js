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
    data._keys  = [];           // Non 'Date' properties, neither special ones
    for (var k in data) {
      if (k !== "Date" && /^[a-zA-Z]\w*/.test(k))
        data._keys.push({name: k, selected: true});
    }

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
        $scope.data_selection = data;
        // Clear the error messages
        $scope.error = '';
        // Update checkboxes
        for (var i = 0, l = $scope.data._keys.length; i < l; ++i)
          $scope.data._keys[i]['selected'] = true;
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

  // When form submitted
  $scope.fetchTimeseries = function () {
    GETTimeseries($scope.type,
      Date.parse($scope.start_date),
      Date.parse($scope.end_date)
    );
  };
  // Defaults
  $scope.type = 'MCL';
  $scope.start_date = '1/1/2013';
  $scope.end_date = '1/13/2013';
  // Let's do it in the beginning!
  $scope.fetchTimeseries();
        
  // When checkboxes
  $scope.updateSelection = function (name, was_selected) {
    //Index
    var i = $scope.data_selection._keys.map(function (d) {
      return d.name;
    });
    $scope.data_selection._keys[i] = !was_selected;
  
  //var new_selection = {'Date': $scope.data['Date']};
  //for (var i = 0, l = $scope.data._keys.length; i < l; ++i) {
  //  if ($scope.data._keys[i].selected)
  //    new_selection[$scope.data._keys[i].name] = $scope.data[$scope.data._keys[i].name];
  //}
  //console.log('new selection');
  //console.log(new_selection);
  //$scope.data_selection = new_selection;
  };
}
GraphCtrl.$inject = ['$scope', '$http', 'TimeseriesGET'];

