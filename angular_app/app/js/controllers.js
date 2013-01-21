'use strict';

/* Controllers */

function GraphCtrl ($scope, TimeseriesGET, ChoicesGET) {


  /**
   * Checks that data is of the form {Date: ..., header1: ..., ...}.
   * @param {} data Object from JSON.
   * @return {bool} Ok?
   */
  var checkData = function (data) {
    /* TODO We could do some inconsistency checking:
    // Get 'date' column
    var date_property = '';
    for (var property in data) {
      if (property.toLowerCase() === 'date')
        date_property = property;
    }
    if (date_property == '')
      return false;
    data._date_property = date_property;
    */

    if (typeof data.Date === 'undefined')
      return false;

    // Store relevant values in data for later access
    data._N = data.Date.length;
    // Properties != 'Date', neither special ones (data is a Resource
    // Angular object).
    data._keys  = (function () {  
      var r = [];
      for (var k in data) {
        if (k !== "Date" && /^[a-zA-Z]\w*/.test(k)) {
          // For each series, we store the name, if it is selected (should be
          // displayed, and some inferred values
          r.push({
            name: k,
            selected: true,
            min: d3.min(data[k]).toFixed(),
            max: d3.max(data[k]).toFixed(),
            mean: d3.mean(data[k]).toFixed()
          });
        }
      }
      return r;
    })();

    return true;
  };

  /**
   * Gets the timeseries through TimeseriesGET service.
   * @param {string} type The type as requested by the server endpoint.
   * @param {string, int} start_date Start date as requested by server, ms
   *  since epoch.
   * @param {string, int} end_date
   */
  var GETTimeseries = function (type, start_date, end_date) {

    TimeseriesGET.get({
      type: type, start: start_date, end: end_date
    }, function (data) {
      if (checkData(data)) {
        $scope.data = data;
        // Clear the error messages
        $scope.error = '';
        // Update checkboxes
        for (var i = 0, l = $scope.data._keys.length; i < l; ++i)
          $scope.data._keys[i]['selected'] = true;
      }
      else {
        $scope.error = "Bad response from the server.";
      }
    }, function (data, status) {
      $scope.error = 'Fetch error: ' + status;
    });
  };

  /**
   * Called when form submitted. To fetch new timeseries to plot.
   */
  $scope.fetchTimeseries = function () {
    console.log($scope);
    GETTimeseries($scope.type,
                  Date.parse($scope.start_date),
                  Date.parse($scope.end_date)
                 );
  };

  // Choices
  ChoicesGET.get(function (data) {
    $scope.choices = data;

    // Defaults
    $scope.type = $scope.choices.types[0].id;
    $scope.start_date = $scope.choices.dates[0];
    $scope.end_date = $scope.choices.dates[14];

    // Plot at start!
    $scope.fetchTimeseries();
  }, function (data, status) {
    $scope.error = 'Fetch error: ' + status;
  });
}
GraphCtrl.$inject = ['$scope', 'TimeseriesGET', 'ChoicesGET'];
