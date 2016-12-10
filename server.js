var express = require('express'),
    querystring = require('querystring'),
    app = express()

app.post('/tropo', (req, res) => {
  console.log("POST request")
  console.log("req", req);
  res.send("it works");
});

app.get('/tropo', (req, res) => {
  console.log("GET request")
  console.log("req", req);
  res.send("it twerks");
});

app.listen(8080);