var express = require('express'),
    querystring = require('querystring'),
    app = express(),
    pg = require('pg');

//var db = new pg.Client();

//db.connect(process.env.DATABASE_URL, (err, client, done) => {
//  if (err)
//    throw err;
//  done();
//});

app.post('/tropo', (req, res) => {
  console.log("POST request")
  res.send("it works");
});

app.get('/tropo', (request, response) => {
  console.log("GET request");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM user', function(err, result) {
      done();
      if (err) { 
        console.error(err); 
        response.send("Error " + err);  
      }
      else { 
        response.render('pages/db', {results: result.rows} );
      }
    });

  });
  //res.status(200).send("it twerks").end();
});

app.listen(process.env.PORT || 5000);
