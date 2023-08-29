'use strict';

const express = require('express');
const mysql = require('mysql');
const Twig = require("twig");
const session = require("express-session");
const fileUpload = require('express-fileupload');
const fs = require('fs');

const tables = require("./src/bdd.cjs");
const user_model = require("./src/Models/user_model.cjs")

const user_controller = require("./src/Controllers/user_controller.cjs");
const librarie_controller = require("./src/Controllers/librarie_controller.cjs");
const credit_controller = require("./src/Controllers/credit_controller.cjs");

//////////////////////////////////////////////BDD//////////////////////////////////////////////////////////////////////
tables.createTables();

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

////////////////////////////////////////////////APP//////////////////////////////////////////////////////////////////////
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'GtechCDA'}));

app.use(fileUpload());

app.set("twig options", {
  allowAsync: true, // Allow asynchronous compiling
  strict_variables: false
});

app.get('/', (req, res) => {
  let context = {
  };
  user_model.User.findById(req.session.user_id).then((user) => {
    context.userSession = user;
    res.render('index.html.twig' , context);
  })
  .catch(() => {
    res.render('index.html.twig' , context);
  });
});

app.use(user_controller);
app.use(librarie_controller);
app.use(credit_controller);

app.get('/media/:type/:uuid', function (req, res) {
  let type = req.params.type;
  let uuid = req.params.uuid;
  let path = __dirname + "/media/" + type + "/" + uuid;
  if (fs.existsSync(path)){
    res.sendFile(path);
  }
  else {
    res.render('404.html.twig');
  }
});

app.use('/static', express.static('static'))

app.use(function (req, res) {
  res.status(404).render("404.html.twig");
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});