var bodyParser = require('body-parser');
var express = require('express'),
  querystring = require('querystring'),
  app = express(),
  pg = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres@10.238.29.166:5432/vertKawaaDb';

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
      const session = create_session(number);
      session['missing_name'] = true;
      return true;
    }
    return false;
  });
}

function create_session(phonenumber) {
  const session = { phonenumber: phonenumber, firstname_missing: true }
  sessions.push(session);
  return session;
}

function find_session(phonenumber) {
  console.log(sessions)
  return sessions.find(s => s.phonenumber == phonenumber);
}

var sessions = []; // { phonenumber: string, context: string }

// Receiving HTTP requests
// -----------------------
app.post('/tropo', (req, res) => {

  console.log("POST request");
  console.log(req.body);
  const message = req.body.text;
  const num = req.body.phonenumber;
  const session = find_session(num);
  console.log(session)
    if (!session) {
      console.log('newUser');
      create_session(num);
      res.send(JSON.stringify({"question": "Quel est ton prénom ?"})).end();
    }
    else if (session.firstname_missing) {
      console.log('askedName');
      session.firstname_missing = false;
      session.firstname = message;
      session.tree_missing = true;
      res.send(JSON.stringify({"question": 'Merci ' + session.firstname  + '! Quel est le numéro de ton arbre ?'})).end();
    }
    else if (session.tree_missing) {
      console.log('askedTree');
      session.tree_missing = false;
      session.tree = message;
      const q = "INSERT INTO users(phone_number, first_name, tree_id) VALUES (" + session.phonenumber + "," + session.firstname + "," + session.tree + ")";
      client.query(q);
      res.send(JSON.stringify({"question": "Ton arbre est bien " + message})).end();
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
