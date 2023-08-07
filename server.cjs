'use strict';

const tables = require("./scripts/bdd.cjs");
const express = require('express');
const mysql = require('mysql');
const Twig = require("twig");
const session = require("express-session");

var con = mysql.createConnection({
  host: "cda-db",
  user: "admin",
  password: "tempPassword1234!",
  database: "db"
});

//////////////////////////////////////////////BDD//////////////////////////////////////////////////////////////////////
tables.createTables();

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

////////////////////////////////////////////////APP//////////////////////////////////////////////////////////////////////
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'Your_Secret_Key'}));

app.set("twig options", {
  allowAsync: true, // Allow asynchronous compiling
  strict_variables: false
});

app.get('/', (req, res) => {
  let context = {
    index : true
  };
  if(req.session.user !=  null){
    let userSession = new tables.Account();
    userSession.update(req.session.user.email, req.session.user.password);
    context.userSession = userSession;
  }

  res.render('index.html.twig' , context);
});

app.get('/inscription', (req, res) => {
  let context = {
  };
  res.render('inscription.html.twig' , context);
});

app.post('/inscriptionUser', (req, res) => {
  let context = {
  };
  if (req.body.password == req.body.repassword){
    let user = new tables.Account(req.body.mail,req.body.password);
    user.create();
    context.userSession = user;
    req.session.user = user;
    console.log("salut");
    res.render('accountValidated.html.twig' , context);


  }
  else{
    context.message = "Passwords do not match";
    res.render('inscriptionUser.html.twig' , context);
  }
});

app.get('/inscriptionUser', (req, res) => {
  let context = {
  };
  res.render('inscriptionUser.html.twig' , context);
});

app.get('/inscriptionCreator', (req, res) => {
  let context = {
  };
  res.render('inscriptionCreator.html.twig' , context);
});

app.get('/profile', (req, res) => {
  let context = {
  };
  if(req.session.user !=  null){
    let userSession = new tables.Account();
    userSession.update(req.session.user.email, req.session.user.password);
    context.userSession = userSession;
    // document.querySelector("#Disconnect").addEventListener("click", () => {
    //                                                                         req.session.user = null;
    //                                                                         res.redirect('index.html.twig');
    //                                                                       });
  }
  res.render('profile.html.twig' , context);
});

app.post('/profile', (req, res) => {
  let context = {
  };
  console.log(req.body.mail);
  if (req.body.mail != null){
    console.log('salut');
    let userSession = new tables.Account();
    userSession.update(req.session.user.email, req.session.user.password);
    console.log("alors : " + userSession.findByMail(userSession.email));
  }

  res.render('profile.html.twig' , context);


});

app.use('/static', express.static('static'))

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});