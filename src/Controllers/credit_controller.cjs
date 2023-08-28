const { Router } = require('express');
const app = Router();
const credit_model = require("../Models/credit_model.cjs");
const user_model = require("../Models/user_model.cjs")

app.get('/credits', (req, res) => {
    let context = {
    };
    user_model.User.findById(req.session.user_id).then((user) => {
      credit_model.createMultiple(100, user.id);
      res.redirect("/libraries");
    })
    .catch((err) => {
      console.log(err);
      res.render("404.html.twig", context);
    });
});

module.exports = app;