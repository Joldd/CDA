const { Router } = require('express');
const app = Router();
const user_model = require("../Models/user_model.cjs");
const library_model = require("../Models/library_model.cjs");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cda.transporter@gmail.com',
    pass: 'uedcewwzfzeyhxrf'
  },
  tls : { rejectUnauthorized: false }
});
const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./views/mails'),
      defaultLayout: false,
  },
  viewPath: path.resolve('./views/mails'),
};
transporter.use('compile', hbs(handlebarOptions));

app.get('/register', (req, res) => {
  let context = {};
  res.render('users/register.html.twig', context);
});

app.get('/registerUser', (req, res) => {
  let context = {};
  res.render('forms/registerUser.html.twig', context);
});

app.post('/registerUser', (req, res) => {
  let context = {};
  if (req.body.password == req.body.repassword) {
    user_model.User.findByMail(req.body.email).then(() => {
      context.message = "This email address has already been registered";
      res.render('forms/registerUser.html.twig', context);
    })
    .catch(() => {
      let user = new user_model.User();
      user.email = req.body.email;
      bcrypt.genSalt(Math.random()).then((salt) => {
        user.salt = salt;
        bcrypt.hash(req.body.password , salt).then((hash) => {
          user.password = hash;
          user.type = 0;
          user.create().then(() => {
            let mailOptions = {
              from: 'cda.transporter@gmail.com',
              to: req.body.email,
              subject: 'CDA - Confirm your account',
              template: 'validationMail',
              context: {
                id: user.id
              }
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                user.delete();
                context.message = "Use an existing email adress";
                res.render('forms/registerUser.html.twig', context);
              } else {
                console.log('Email sent: ' + info.response);
                res.render('users/accountValidated.html.twig', context);
              }
            })
          })
          .catch((err) => {
            console.log(err);
            res.render("404.html.twig", context);
          });
        })
        .catch((err) => {
          console.log(err);
          res.render("404.html.twig", context);
        });
      })
      .catch((err) => {
        console.log(err);
        res.render("404.html.twig", context);
      });
    })    
  } else {
    context.message = "Passwords do not match";
    res.render('forms/registerUser.html.twig', context);
  }
});

app.get('/validate/:id', (req, res) => {
  let context = {};
  user_model.User.findById(req.params.id).then((user) => {
    user.mailIsConfirmed = 1;
    user.update();
    req.session.user_id = user.id;
    res.redirect("/");
  })
  .catch((err) => {
    console.log(err);
    res.render("404.html.twig", context);
  });
})

app.get('/registerCreator', (req, res) => {
  let context = {};
  res.render('forms/registerCreator.html.twig', context);
});

app.post('/registerCreator', (req, res) => {
  let context = {};
  if (req.body.password == req.body.repassword) {
    user_model.User.findByMail(req.body.email).then(() => {
        context.message = "This email address has already been registered";
        res.render('forms/registerCreator.html.twig', context);
      })
      .catch(() => {
        let user = new user_model.User();
        user.email = req.body.email;
        user.password = req.body.password;
        user.societyAdress = req.body.adress+' '+req.body.postcode+' '+req.body.city+' '+req.body.country;
        user.siren = req.body.sirenNumber;
        user.paypalAdress = req.body.paypalAdress;
        user.kbis = req.body.kBis;
        user.type = 1;
        user.create().then(() => {
            context.userSession = user;
            req.session.user_id = user.id;
            res.render('users/accountValidated.html.twig', context);
          })
          .catch((err) => {
            context.message = "User already exists";
            res.render('forms/registerCreator.html.twig', context);
          });
      })
  } else {
    context.message = "Passwords do not match";
    res.render('forms/registerCreator.html.twig', context);
  }
});

app.get('/login', (req, res) => {
  let context = {};
  res.render('forms/login.html.twig', context);
});

app.post('/login', (req, res) => {
  let context = {};
  user_model.User.findByMail(req.body.email).then((user) => {
      bcrypt.compare(req.body.password , user.password, (err, result) => {
        if (err){
          console.log(err);
          res.render("404.html.twig", context);
        }
        else if (!result){
          context.message = "Wrong password";
          res.render("forms/login.html.twig", context);
        }
        else {
          if (user.mailIsConfirmed == 1){
            req.session.user_id = user.id;
            if (user.type == 0){
              res.redirect("/");
            }
            else if (user.type == 1){
              res.redirect("/libraries");
            }
            else{
              res.redirect("/manage");
            }
          }
          else {
            context.message = "You need to confirm your email adress";
            res.render("forms/login.html.twig", context);
          }
        }
      })          
    })
    .catch((err) => {
      console.log(err);
      context.message = "This email doesn't exist";
      res.render("forms/login.html.twig", context);
    });
});

app.get('/profile', (req, res) => {
  let context = {};
  user_model.User.findById(req.session.user_id).then((user) => {
      context.userSession = user;
      res.render('forms/profile.html.twig', context);
    })
    .catch(() => {
      res.render('404.html.twig', context);
    });
});

app.post('/profile', (req, res) => {
  let context = {};
  user_model.User.findById(req.session.user_id).then((user) => {
      if (req.body.password == req.body.repassword) {
        if (req.body.email.length > 0) {
          user.email = req.body.email;
        }
        if (req.body.password.length > 0) {
          user.password = req.body.password;
        }
        if (req.files != null) {
          let uploadedImage = req.files.image;
          console.log("a");
          user.image = uuidv4();
          let uploadImagePath = "media/profile/" + user.image + ".png";
          uploadedImage.mv(uploadImagePath, function (err) {
            if (err) {
              console.log(err);
              console.log("Failed !!");
            } else console.log("Successfully Uploaded !!");
          });
        }
        user.update();
        req.session.user_id = user.id;
        context.userSession = user;
        context.message = "Your profile has been updated !";
        context.color = "green";
        res.render('forms/profile.html.twig', context);
      } else {
        context.message = "Passwords do not match !";
        context.color = "red";
        res.render('forms/profile.html.twig', context);
      }
    })
    .catch(() => {
      res.render('404.html.twig', context);
    });
});

app.post('/disconnect', (req, res) => {
  let context = {};
  req.session.user_id = null;
  res.redirect("/store");
});

module.exports = app;