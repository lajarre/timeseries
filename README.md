timeseries
==========

CSV times series, expressjs => angular => d3 => svg.

How it works
---

4 CSV are parsed, corresponding to 4 types:
  - MCL: Messages, Comments and Likes numbers (3 columns)
  - COMPMCL: idem for the competition (or, say, the whole market segment)
  - FR: Followers, Followers evolution, Reach and Magic Ratio numbers (4 columns)
  - COMPFR: idem for the competition.

Every time series has a step of 1 day.
CSV files must comply with the following:
  - There must be a header line
  - There must be date column, named 'Date' in the header (case-sensitive), with dates written either in a Date.parse() compliant way
  - The other columns must be have names made of alphanumeric characters and underscores only. Data supported is only Int and Float.

3 GET parameters are passed to the API:
  - type (see above)
  - start: a Date.parse()-readable string representing the first day (eg. 1/13/2013), included
  - end: ditto, not included

Returns a JSON in the following form:
> {Date: [], header1: [], header2: [], ...}

There are as many headers as colums in the sepecified type.

What to do
---

To init (needs express and lazy):
> npm install

To run:
> node app.js

To test, try those urls:
  - http://localhost:3000/time_series?type=FR&start=1/02/2013&end=1/22/2013
  - http://localhost:3000/time_series?type=COMPFR&start=1/02/2013&end=1/20/2013
  - http://localhost:3000/time_series?type=MCL&start=1/02/2013&end=1/12/2013
  - http://localhost:3000/time_series?type=COMPMCL&start=1/12/2013&end=1/13/2013
  - http://localhost:3000/time_series?type=iammakingamistake&start=1/13/2013&end=1/13/2013
