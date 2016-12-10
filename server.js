var express = require('express'),
    querystring = require('querystring'),
    app = express(),
    pg = require('pg');


app.post('/tropo', (req, res) => {
  console.log("POST request")
  console.log("req", req);
  res.send("it works");
});

app.get('/tropo', (req, res) => {
  pg.defaults.ssl = true;
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
      .query('SELECT * FROM users;')
      .on('row', (row) => {
        var result = JSON.stringify(row);
        res.json(result).end();
      });

  });

});

app.listen(process.env.PORT || 8080);
