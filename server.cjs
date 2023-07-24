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
  console.log("Connected to bdd cda-db!");

  //Prices
  con.query(
    `CREATE TABLE IF NOT EXISTS prices(
      id INT NOT NULL,
      minNumberPurchased INT NOT NULL,
      price INT NOT NULL,
      PRIMARY KEY (id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table prices created");
    }
  );
  
  //Account
  con.query(
    `CREATE TABLE IF NOT EXISTS account(
      id INT NOT NULL,
      name VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      mailIsConfirmed BOOLEAN,
      image VARCHAR(255),
      Description TEXT,
      societyAdress VARCHAR(255),
      siren INT,
      paypalAdress VARCHAR(255),
      kbis VARCHAR(255),
      PRIMARY KEY (id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table account created");
    }
  );

  //Credits
  con.query(
    `CREATE TABLE IF NOT EXISTS credits(
      id INT NOT NULL,
      purchaseDate DATETIME NOT NULL,
      validity INT NOT NULL DEFAULT 63115200,
      price INT NOT NULL,
      account_id INT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES account(id),
      PRIMARY KEY (id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table credits created");
    }
  );

  //Discount
  con.query(
    `CREATE TABLE IF NOT EXISTS discounts(
      id INT NOT NULL,
      acquisitionDate DATETIME NOT NULL,
      validity INT NOT NULL DEFAULT 63115200,
      percentage INT NOT NULL,
      account_id INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (account_id) REFERENCES account(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table discount created");
    }
  );

  //Librairies
  con.query(
    `CREATE TABLE IF NOT EXISTS libraries(
      id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      type ENUM('Scene','Character','Item','Image_and_police'),
      price INT NOT NULL,
      state ENUM('accepted','validating','rejected'),
      releaseDate DATETIME NOT NULL,
      salesNumber INT NOT NULL,
      encouragementsNumber INT NOT NULL,
      owner_id INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (owner_id) REFERENCES account(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table librairies created");
    }
  );

  //Tags
  con.query(
    `CREATE TABLE IF NOT EXISTS tags(
      id INT NOT NULL,
      name VARCHAR(255),
      isActive BOOLEAN DEFAULT FALSE,
      PRIMARY KEY (id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table tags created");
    }
  );

  //Librairies_Tags
  con.query(
    `CREATE TABLE IF NOT EXISTS libraries_tags(
      library_id INT NOT NULL,
      tag_id INT NULL,
      FOREIGN KEY (library_id) REFERENCES libraries(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table Libraries_Tags created");
    }
  );

  //User_Librairies
  con.query(
    `CREATE TABLE IF NOT EXISTS users_libraries(
      id INT NOT NULL,
      account_id INT NOT NULL,
      library_id INT NULL,
      purchaseDate DATETIME NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (library_id) REFERENCES libraries(id),
      FOREIGN KEY (account_id) REFERENCES account(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table User_Librairies created");
    }
  );

  //Receipts
  con.query(
    `CREATE TABLE IF NOT EXISTS receipts(
      purchase_id INT NOT NULL,
      tags VARCHAR(255),
      purchaseDate DATETIME NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      FOREIGN KEY (purchase_id) REFERENCES users_libraries(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table receipts created");
    }
  );

  //Approvement
  con.query(
    `CREATE TABLE IF NOT EXISTS approvement(
      library_id INT NOT NULL,
      date DATETIME NOT NULL,
      commentary TEXT NOT NULL DEFAULT '',
      isAccepted BOOLEAN NOT NULL,
      FOREIGN KEY (library_id) REFERENCES libraries(id)
    );`
    , 
    function (err, result) 
    {
      if (err) throw err;
      console.log("Table approvement created");
    }
  );
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