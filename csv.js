// File operations

var Lazy = require('lazy'),
    util = require('util'),
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

/**
 * Parses a line and returns an array of substrings.
 * Should be used to retrieve headers on first line of a .csv.
 */
var getHeader = function (line) {
  return line.trim().split(DELIM);
};

/**
 * Depending on the type of the data, returns a function that extracts
 * line contents from a CSV file with their proper types.
 * @param {string} type The type of the data requested.
 * @return {function (string): Array()} Function used to parse lines.
 */
var getRowDataFactory = function(type) {
  return function (line) {
    var splitted = line.trim().split(DELIM);
    var l = splitted.length,
        result = [];
    for (var i = 0; i < l; ++i) {
      var data_type = DATA_TYPES[type][i];
      if (data_type == DATE_TYPE)
        result.push(Date.parse(splitted[i])); // Int (ms since epoch)
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
 *     form {'Date': [], 'header1': [], 'header2': [], ...}.
 */
var parseCSV = function (type, start_date, end_date, callback) {

  try {
    var file_name = DATA_FOLDER + type + '.csv',
    first_line = true,                // flag
    header = {},
    columns = {},                     // To be passed to callback.
    getRowData = getRowDataFactory(type);

    // Test file existence
    if (!fs.statSync(file_name).isFile()) // Throws if no path on fs.
      throw new Error(400);               // Throws if not a file.
    
    else {
      new Lazy(fs.createReadStream(file_name))
      .on('end', function () {
        //util.debug(columns.toString());
        return callback(columns);
      })
      .lines
      .forEach(function (linebuf) {
        if (first_line) {               // Header of the CSV.
          first_line = false;
          header = getHeader(linebuf.toString());
          for (var i = 0; i < header.length; ++i) {
            columns[header[i]] = [];
          }
        }
        else {
          var row_data = getRowData(linebuf.toString());
          var date = row_data[0];
          if (start_date <= date && date < end_date) {
            for (var i = 0, l = row_data.length; i < l; ++i) {
              columns[header[i]].push(row_data[i]);
            }
          }
        }
      });
    }

  } catch (e) {
    util.debug(e.message);
    callback(400); // Bad request
  }

};


// Export parseCSV
module.exports = {parseCSV: parseCSV};
