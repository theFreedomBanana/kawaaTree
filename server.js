var express = require('express'),
    querystring = require('querystring'),
    app = express(),
    pg = require('pg').Client();

pg.connect(process.env.DATABASE_URL, err => {
  if (err)
    throw err;
});

app.post('/tropo', (req, res) => {
  console.log("POST request")
  res.send("it works");
});

app.get('/tropo', (req, res) => {
  console.log("GET request");
  pg.query('SELECT * FROM users', (err, res) => {
    res.json(res);
  });
  //res.status(200).send("it twerks").end();
});

app.listen(process.env.PORT || 5000);
