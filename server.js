var bodyParser = require('body-parser');
var express = require('express'),
  querystring = require('querystring'),
  app = express(),
  pg = require('pg');

const connectionString = 'postgres://postgres@10.238.29.166:5432/vertKawaaDb';

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
  return client.query("select * from users where phonenumber='" + number + "';").then(data => {
    if (data.rows.length == 0) {
      client.query(`insert into users(phonenumber) values (${number})`);
      return true;
    }
    return false;
  });
}

function create_session(phonenumber) {
  
}

function find_session() {
  
}

var sessions = []; // { phonenumber: string, first_name: string, last_name: string }

// Receiving HTTP requests
// -----------------------
app.post('/tropo', (req, res) => {

  console.log("POST request");
  if (req.body.text == 'adopter') {
    isNewUser(req.body.phonenumber).then(newUser => {
      if (newUser) {
        res.send(JSON.stringify({"question": "Quel est ton prénom ?"})).end();
      }
      else {
        res.send(JSON.stringify({"question": 'Quel est le numéro de ton arbre ?'})).end();
      }
    });
  }
});

app.get('/tropo', (req, res) => {
  console.log("GET request")
  if (req.query.phone_number) {

  };
  res.send(JSON.stringify("it twerks"));
  res.end();
});

app.listen(process.env.PORT || 8080);
