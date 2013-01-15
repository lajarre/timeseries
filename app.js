// File operations

var Lazy = require('lazy'),
	fs = require('fs');

// Globals
var DATA_FOLDER = 'data/',
	DELIM = ';',
	DATE_TYPE = 0,
	INT_TYPE = 1,
	FLOAT_TYPE = 2;
var MCL_DATA = [DATE_TYPE, INT_TYPE, INT_TYPE, INT_TYPE],
	FR_DATA = [DATE_TYPE, INT_TYPE, INT_TYPE, INT_TYPE, FLOAT_TYPE];
var DATA_TYPES = {
		'MCL' : MCL_DATA,
		'COMPMCL': MCL_DATA,
		'FR': FR_DATA,
		'COMPFR': FR_DATA
	};

var getHeader = function (line) {
	return line.trim().split(DELIM);
};

/**
 * Depending on the type of the data, returns a function that extracts
 * line contents from a CSV file with their proper types.
 * @param {string} type The type of the data requested.
 * @return {function (string): Array()} Function used to parse lines.
 */
var rowDataGetter = function(type) {
	return function (line) {
		var splitted = line.trim().split(DELIM);
		var l = splitted.length,
			result = [];
		for (var i = 0; i < l; ++i) {
			var data_type = DATA_TYPES[type][i];
			if (data_type == DATE_TYPE)
				result.push(Date.parse(splitted[i]));
			else if (data_type == INT_TYPE)
				result.push(parseInt(splitted[i]));
			else if (data_type == FLOAT_TYPE)
				result.push(parseFloat(splitted[i]));
		}
		return result;
	};
};

/**
 * Parses the CSV file corresponding to type and extracts all data
 * from rows that are between start (included) and end (excluded)
 * dates, as columns.
 * Depends of the header of the file.
 * @param {string} type The type of the data requested.
 * @param {string} start The start date in a Data.parse() readable format.
 * @param {string} end The end date in a Data.parse() readable format.
 * @param {function(object)} callback Takes an object and renders it
 *     through expressjs. If no error occured, the object has the
 *     form {date: [], header1: [], header2: [], ...}.
 */
var parseCSV = function (type, start, end, callback) {
	try {
		var file_name = DATA_FOLDER + type + '.csv',
			start_date = Date.parse(start),
			end_date = Date.parse(end),
			first_line = true,			// flag
			columns = {},				// To be passed to callback.
			getRowData = rowDataGetter(type);
		// Test file existence
		if (!fs.statSync(file_name).isFile()) // Throws if no path on filesystem.
			throw new Error(400); // Throws if path exists but it's not a file.
		else {
			new Lazy(fs.createReadStream(file_name))
				.on('end', function () {
					console.log(columns);
					return callback(columns);
				})
				.lines
				.forEach(function (linebuf) {
					if (first_line) { // header
						first_line = false;
						header = getHeader(linebuf.toString());
						for (var i = 0; i < header.length; ++i) {
							columns[header[i]] = [];
						}
					}
					else {
						var row_data = getRowData(linebuf.toString());
						var date = row_data[0];
						if (start_date <= date && date < end_date) { // end date not included
							for (var i = 0; i < row_data.length; ++i) {
								columns[header[i]].push(row_data[i]);
							}
						}
					}
				});
		}
	} catch (e) {
		console.log(e);
		callback(400); // Bad request
	}
};

// Web server

var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

app.get('/time_series', function(req, res) {
	parseCSV(req.query.type, req.query.start, req.query.end, function (body) {
		console.log('callbas');
		//res.setHeader('Content-Type', 'application/json');
		//res.setHeader('Content-Length', body.length);
		res.send(body);
		res.end();
	});
});

app.listen(3000);
