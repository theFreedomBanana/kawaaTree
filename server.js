var bodyParser = require('body-parser');
var express = require('express'),
  querystring = require('querystring'),
  app = express(),
  pg = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://10.238.29.166:5432/vertKawaaDb';

app.use(bodyParser());
var client = new pg.Client(connectionString); 
client.connect();

function logUser() {
  var query = client.query('select * from users;')
  query.on('row', function(row) {
    console.log(row);
  })
}

function isNewUser(number) {
  var query = client.query("select COUNT(*) as phone from users where phonenumber='" + number + "';", [], function (err, rows, fields){
    console.log(rows);
    if (rows[0].phone == 0) {
      client.query(`insert into users(phonenumber) values (${number})`);
    }
  });
  console.log(query);
  //query.on('row', function(row) {
    
  //})
}

// Receiving HTTP requests
// -----------------------
app.post('/tropo', (req, res) => {
  console.log("POST request")
  // logUser();
  isNewUser(req.body.phonenumber);
  res.send(JSON.stringify({foo: "it twerks"}));
  res.end();
});

app.get('/tropo', (req, res) => {
  console.log("GET request")
  if (req.query.phone_number) {

  };
  res.send(JSON.stringify("it twerks"));
  res.end();
});

app.listen(8080);