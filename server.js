var express = require('express'),
    querystring = require('querystring'),
    app = express(),
    pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM users;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));

    });

});

app.post('/tropo', (req, res) => {
  console.log("POST request")
  console.log("req", req);
  res.send("it works");
});

app.get('/tropo', (req, res) => {
  console.log("GET request")
  console.log("req", req);
  res.status(200).send("it twerks");
});

app.listen(8080);
