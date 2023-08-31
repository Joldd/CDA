
const { Router } = require('express');
const app = Router();
const user_model = require("../Models/user_model.cjs");
const library_model = require("../Models/library_model.cjs");
const { v4: uuidv4 } = require('uuid');

app.get('/inscription', (req, res) => {
  let context = {
  };
  res.render('users/inscription.html.twig' , context);
});

app.get('/inscriptionUser', (req, res) => {
  let context = {
  };
  res.render('forms/inscriptionUser.html.twig' , context);
});

app.post('/inscriptionUser', (req, res) => {
  let context = {
  };
  if (req.body.password == req.body.repassword){
    let user = new user_model.User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.create().then(() => {
      context.userSession = user;
      req.session.user_id = user.id;
      res.render('users/accountValidated.html.twig' , context);
    })
    .catch((err) => {
      context.message = "User already exists";
      res.render('forms/inscriptionUser.html.twig' , context);
    });  
  }
  else{
    context.message = "Passwords do not match";
    res.render('forms/inscriptionUser.html.twig' , context);
  }
});

app.get('/inscriptionCreator', (req, res) => {
  let context = {
  };
  res.render('forms/inscriptionCreator.html.twig' , context);
});
  
app.get('/login', (req, res) => {
  let context = {
  };
  res.render('forms/login.html.twig' , context);
});
  
app.post('/login', (req, res) => {
  let context = {
  };
  user_model.User.findByMail(req.body.email).then((user) => {
    if (user.password == req.body.password){
      req.session.user_id = user.id;
      context.userSession = user;
      res.render('index.html.twig' , context);
    }
    else{
      context.message = "Wrong password";
      res.render("forms/login.html.twig" , context);
    }
  })
  .catch((err) => {
    console.log(err);
    context.message = "This email doesn't exist";
    res.render("forms/login.html.twig" , context);
  });
});
  
app.get('/profile', (req, res) => {
  let context = {
  };
  user_model.User.findById(req.session.user_id).then((user) => {
    context.userSession = user; 
    res.render('forms/profile.html.twig' , context);
  })
  .catch(() => {
    res.render('404.html.twig' , context); 
  });
});
  
app.post('/profile', (req, res) => {
  let context = {
  };
  user_model.User.findById(req.session.user_id).then((user) => {
    if (req.body.password == req.body.repassword){
      if (req.body.email.length > 0){
        user.email = req.body.email;  
      }
      if (req.body.password.length > 0){
        user.password = req.body.password;
      }
      if(req.files != null){
        let uploadedImage = req.files.image;  
        console.log("a");
        user.image = uuidv4();
        let uploadImagePath = "media/profile/"+user.image+".png";
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
      res.render('forms/profile.html.twig' , context);
    }
    else {
      context.message = "Passwords do not match !";
      context.color = "red";
      res.render('forms/profile.html.twig' , context);
    }
  })
  .catch(() => {
    res.render('404.html.twig' , context); 
  });
});
  
app.post('/disconnect', (req, res) => {
  let context = {
  };
  req.session.user_id = null;
  res.render('index.html.twig' , context);
});

module.exports = app;