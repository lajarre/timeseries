var csv = require('./csv.js');

var express = require('express');
var app = express();


// Directory serve for Angular app on '/'
app.use(express.static(__dirname + '/angular_app'));

// GET endpoint serving the time series JSONs
app.get('/time_series', function(req, res) {

  // Modifies date if written not as integer format
  var dateCheck = function (date) {
    if (parseInt(date) != date)
      return Date.parse(date);
    else
      return date;
  }
  var start_date = dateCheck(req.query.start),
  end_date = dateCheck(req.query.end);

  csv.parseCSV(req.query.type, req.query.start, req.query.end, function (body) {
    res.json(body);
    res.end();
  });
});

// GET for the choices available
app.get('/time_series_choices', function (req, res) {
  res.json({
    types: [
      {id: 'MCL', name: 'Messages, comments & likes'},
      {id: 'COMPMCL', name: 'Messages, comments & likes (industry)'},
      {id: 'FR', name: 'Followers & reach'},
      {id: 'COMPFR', name: 'Followers & reach (industry)'}
    ],
    dates: [
      '1/1/2013',
      '1/2/2013',
      '1/3/2013',
      '1/4/2013',
      '1/5/2013',
      '1/6/2013',
      '1/7/2013',
      '1/8/2013',
      '1/9/2013',
      '1/10/2013',
      '1/11/2013',
      '1/12/2013',
      '1/13/2013',
      '1/14/2013',
      '1/15/2013',
      '1/16/2013',
      '1/17/2013',
      '1/18/2013',
      '1/19/2013',
      '1/20/2013',
      '1/21/2013',
      '1/22/2013'
    ]
  }); 
  res.end();
});

app.listen(3000);
