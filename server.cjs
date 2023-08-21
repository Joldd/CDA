'use strict';

const tables = require("./src/bdd.cjs");
const user_model = require("./src/user_model.cjs");
const library_model = require("./src/library_model.cjs");
const user_library_model = require("./src/user_library_model.cjs");

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
  };
  if(req.session.user !=  null){
    context.userSession = req.session.user;
  }
  res.render('index.html.twig' , context);
});

app.get('/inscription', (req, res) => {
  let context = {
  };
  res.render('inscription.html.twig' , context);
});

app.get('/inscriptionUser', (req, res) => {
  let context = {
  };
  res.render('inscriptionUser.html.twig' , context);
});

app.post('/inscriptionUser', (req, res) => {
  let context = {
  };
  if (req.body.password == req.body.repassword){
    let user = new user_model.User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.create();
    context.userSession = user;
    req.session.user = user;
    res.render('accountValidated.html.twig' , context);
  }
  else{
    context.message = "Passwords do not match";
    res.render('inscriptionUser.html.twig' , context);
  }
});

app.get('/inscriptionCreator', (req, res) => {
  let context = {
  };
  res.render('inscriptionCreator.html.twig' , context);
});

app.get('/login', (req, res) => {
  let context = {
  };
  res.render('login.html.twig' , context);
});

app.post('/login', (req, res) => {
  let context = {
  };
    user_model.User.findByMail(req.body.email).then((user) => {
    if (user.password == req.body.password){
      req.session.user = user;
      context.userSession = user;
      res.render('index.html.twig' , context);
    }
    else{
      context.message = "Wrong password";
      res.render("login.html.twig" , context);
    }
  })
  .catch((err) => {
    console.log(err);
    context.message = "This email doesn't exist";
    res.render("login.html.twig" , context);
  });
});

app.get('/profile', (req, res) => {
  let context = {
  };
  if(req.session.user !=  null){
    context.userSession = req.session.user;                                                                   
  };
  res.render('profile.html.twig' , context);
});

app.post('/profile', (req, res) => {
  let context = {
  };
  let user = user_model.User.fromResult(req.session.user);
  if (req.body.password == req.body.repassword){
    if (req.body.email.length > 0){
      user.email = req.body.email;  
    }
    if (req.body.password.length > 0){
      user.password = req.body.password;
    }
    user.update();
    req.session.user = user;
    context.userSession = user;
    context.message = "Your profile has been updated !";
    context.color = "green";
    res.render('profile.html.twig' , context);
  }
  else {
    context.message = "Passwords do not match !";
    context.color = "red";
    res.render('profile.html.twig' , context);
  }
});

app.post('/disconnect', (req, res) => {
  let context = {
  };
  req.session.user = null;
  res.render('index.html.twig' , context);
});

app.get('/libraries', (req, res) => {
  let context = {
  };
  let user = user_model.User.fromResult(req.session.user);
  context.userSession = user;
  user.getLibraries().then((libraries) => {
    context.libraries = libraries;
    res.render('libraries.html.twig' , context);
  })
  .catch((err) => {
    console.log(err);
    res.render('libraries.html.twig' , context);
  });
});

app.post('/newLibrary', (req, res) => {
  let user = user_model.User.fromResult(req.session.user);
  let library = new library_model.Library();
  library.owner_id = user.id;
  library.title = req.body.title;
  library.price = req.body.price;
  library.type = req.body.type;
  library.create();
  res.redirect('/libraries');
});

app.use('/static', express.static('static'))

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});