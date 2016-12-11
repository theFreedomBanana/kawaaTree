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

function getUsersForTree(id) {
  return client.query("select phonenumber  from users where phonenumber='" + number + "';").then(data => {
    if (data.rows.length == 0) {
      client.query(`insert into users(phonenumber) values (${number})`);
      return true;
    }
    return false;
  });
}

function create_session(phonenumber) {
  const session = { 
    phonenumber: phonenumber, 
    firstname_missing: true, 
    lastname_missing: true, 
    tree_id_missing: true, 
    tree_name_missing: true,
    idle: true
  };
  sessions.push(session);
  return session;
}

function find_session(phonenumber) {
  //console.log(sessions)
  return sessions.find(s => s.phonenumber == phonenumber);
}

var sessions = []; // { phonenumber: string, context: string }

// Receiving HTTP requests
// -----------------------
app.post('/tropo', (req, res) => {

  console.log("POST request");
  const message = req.body.text;
  const num = req.body.phonenumber;
  const session = find_session(num);
  console.log(message);
    if (!session) {
      create_session(num);
      res.send(JSON.stringify({
        "question": "Bonjour, nous sommes content de vous compter parmi nous ! Pouvez-vous nous communiquer le numéro de l'arbre ?"
      })).end();
    }
    else if (session.tree_id_missing) {
     // wit.message(message).then(data => {
     //   console.log(data.entities);
     // });
      session.tree_id_missing = false;
      session.tree_id = message;
      res.send(JSON.stringify({
        "question": "Merci bcp ! Vous pouvez proposer un nom de cet arbre."
      })).end();
    }
    else if (session.tree_name_missing) {
      session.tree_name_missing = false;
      session.tree_name = message;
      res.send(JSON.stringify({
        "question": "Super ! Et en fait comment vous appelez-vous ?"
      })).end();
    }
    else if (session.firstname_missing) {
      session.firstname_missing = false;
      //const [ first_name, last_name ] = message.split(' ');
      session.firstname = message;
      res.send(JSON.stringify({
        "question": 'Génial ' + session.firstname  + ' ! Nous vous tiendrons au courant des prochaines rencontres et des actions liées à ' + session.tree_name + '. Bonne journée !'
      })).end();
      const q = "INSERT INTO users (phonenumber, firstname, tree_id) VALUES ('" + session.phonenumber + "','" + session.firstname + "','" + session.tree_id + "')";
      client.query(q);
    }
    else if (session.idle) {
      session.idle = false;
      res.send(JSON.stringify({"question": "Pour plus d'info vous contacter ..."})).end();
    }
    else {
      session = { 
        phonenumber: phonenumber, 
        firstname_missing: false, 
        lastname_missing: true, 
        tree_id_missing: true, 
        tree_name_missing: true,
        idle: true
      };
      res.send(JSON.stringify({"question": "Merci et à bientôt !"})).end();
    }
});

const {Wit, log} = require('node-wit');

const wit = new Wit({
  accessToken: process.env.WIT_TOKEN
});

app.get('/visit', (req, res) => {
  console.log("GET request")
  if (req.query.phone_number) {

  };
  res.end();
});

app.listen(process.env.PORT || 8080);
