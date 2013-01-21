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

2 GET endpoints:

1) `/time_series_choices`   
=> `{types: [{id: , name}, ...], dates: [...]}`
  
2) `/time_series`  
GET parameters:
  - type (see above)
  - start: a Date()-compliant int representing the first day (ms since epoch), included
  - end: ditto, not included   

=> `{Date: [], header1: [], header2: [], ...}`

There are as many headers as colums in the sepecified type.

What to do
---

To init:

`> npm install`

To run:

`> node app.js`

[Try it](http://localhost:3000/app/)
