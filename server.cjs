'use strict';

const express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "cda-db",
  user: "admin",
  password: "tempPassword1234!",
  database: "db"
});

//BDD
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(`CREATE TABLE prices(
    id SERIAL PRIMARY KEY,
    minNumberPurchased INT NOT NULL,
    price INT NOT NULL
  );`, function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  res.sendFile(('/usr/src/app/templates/index.html'));
});

app.get('/inscription', (req, res) => {
  res.sendFile(('/usr/src/app/templates/inscription.html'));
});

app.get('/inscriptionUser', (req, res) => {
  res.sendFile(('/usr/src/app/templates/inscriptionUser.html'));
});

app.get('/inscriptionCreator', (req, res) => {
  res.sendFile(('/usr/src/app/templates/inscriptionCreator.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(('/usr/src/app/templates/profile.html'));
});

app.use('/static', express.static('static'))

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});