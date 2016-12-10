var express = require('express'),
    querystring = require('querystring'),
    app = express(),
    pg = require('pg');


app.post('/tropo', (req, res) => {
  console.log("POST request")
  res.send("it works");
});

app.get('/tropo', (req, res) => {
  console.log("GET request")
  res.status(200).send("it twerks").end();
});

app.listen(process.env.PORT || 5000);
