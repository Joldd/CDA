const { Router } = require('express');
const app = Router();
const { v4: uuidv4 } = require('uuid');

const library_model = require("../Models/library_model.cjs");
const user_model = require("../Models/user_model.cjs");
const user_library_model = require("../Models/user_library_model.cjs");

app.get('/libraries', (req, res) => {
    let context = {
    };
    user_model.User.findById(req.session.user_id).then((user) => {
        context.userSession = user;
        user.getLibraries().then((libraries) => {
            context.libraries = libraries;
            user.getCredits().then((credits) => {
                context.credits = credits;
                res.render('forms/libraries.html.twig' , context);
            })
            .catch((err) => {
                res.render('forms/libraries.html.twig' , context);
            });
        })
        .catch((err) => {
            console.log(err);
            res.render('forms/libraries.html.twig' , context);
        });
    })
    .catch(() => {
        res.render('404.html.twig' , context);
    }); 
});
  
app.post('/newLibrary', (req, res) => {
    let context = {
    };
    console.log(req.session.user_id);
    user_model.User.findById(req.session.user_id).then((user) => {
        let library = new library_model.Library();
        library.owner_id = user.id;
        library.title = req.body.title;
        library.price = req.body.price;
        library.type = req.body.type;
        let uploadedLibrary = req.files.library;
        library.uuid  = uuidv4();
        let uploadLibraryPath = "media/libraries/"+library.uuid+".lib";
        uploadedLibrary.mv(uploadLibraryPath, function (err) {
            if (err) {
                console.log(err);
                console.log("Failed !!");
            } else console.log("Successfully Uploaded !!");
        });
        let uploadedImage = req.files.image;
        library.image  = uuidv4();
        let uploadImagePath = "media/img/"+library.image+".png";
        uploadedImage.mv(uploadImagePath, function (err) {
            if (err) {
                console.log(err);
                console.log("Failed !!");
            } else console.log("Successfully Uploaded !!");
        });
        library.create();
        res.redirect('/libraries');
    })
    .catch((err) => {
        console.log(err);
        res.render('404.html.twig' , context);
    });
});

app.get('/store', (req, res) => {
    let context = {
    };
    library_model.Library.getAll().then((libraries) => {
        context.libraries = libraries;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            res.render("libraries/store.html.twig" , context);
        })
        .catch(() => {
            res.render("libraries/store.html.twig" , context);
        });
    })
    .catch((err) => {
        console.log(err);
        context.message = "No libraries";
        res.render("libraries/store.html.twig" , context);
    });
});

app.get('/store/:type', (req, res) => {
    let context = {
    };
    library_model.Library.getByType(req.params.type).then((libraries) => {
        context.libraries = libraries;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            res.render("libraries/store.html.twig" , context);
        })
        .catch(() => {
            res.render("libraries/store.html.twig" , context);
        })
    })
    .catch((err) => {
        res.render("libraries/store.html.twig" , context);
    });
});

app.get('/library/:uuid', (req, res) => {
    let context = {
    };
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
        context.library = library;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            if (library.owner_id == user.id){
                context.myLibrary = true;
                res.render("libraries/one.html.twig", context);
            }
            else{
                res.render("libraries/one.html.twig", context);
            }
        })
        .catch(() => {
            res.render("libraries/one.html.twig", context);
        });
    })
    .catch(() => {
        res.render("404.html.twig", context);
    });  
});

app.get('/library/:uuid/modify', (req, res) => {
    let context = {
    };
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
        context.library = library;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            if (library.owner_id == user.id){
                res.render("libraries/modify.html.twig", context);
            }
            else {
                res.render("404.html.twig", context);
            }
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });   
    })
    .catch(() => {
        res.render("404.html.twig", context);
    });   
});

app.post('/library/:uuid/modify', (req, res) => {
    let context = {
    };
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
        context.library = library;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            if (library.owner_id == user.id){
                context.myLibrary = true;
                library.title = req.body.title;
                library.price = req.body.price;
                library.description = req.body.description;
                library.update();
                context.message = "Your library has been updated !";
                context.color = "green";
                res.render("libraries/one.html.twig", context);
            }
            else {
                res.render("404.html.twig", context);
            }
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
    })
    .catch(() => {
        res.render("404.html.twig", context);
    });  
});

app.get('/library/:uuid/delete', (req, res) => {
    let context = {
    };
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
        context.library = library;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            if (library.owner_id == user.id){
                library.delete();
                context.message = "Your library has been deleted !"
                res.render("forms/libraries.html.twig", context);
            }
            else {
                res.render("404.html.twig", context);
            }
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
    })
    .catch(() => {
        res.render("404.html.twig", context);
    });
});

app.get('/library/:uuid/buy', (req, res) => {
    let context = {
    };
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
        context.library = library;
        user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            user.getCredits().then((credits) => {
                if (credits.length >= library.price){
                    let user_library = new user_library_model.User_Library();
                    user_library.user_id = user.id;
                    user_library.library_id = library.id;
                    user_library.create();
                    context.message = "Library bought !";
                    context.color = "green";
                }
                else {
                    context.message = "No enough credits !";
                    context.color = "red";
                }
                res.render("libraries/one.html.twig", context);
            })
            .catch(() => {
                res.render("404.html.twig", context);
            });
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
    })
    .catch(() => {
        res.render("404.html.twig", context);
    });
});

app.get('/libraries/history', (req, res) => {
    let context = {
    };
    user_model.User.findById(req.session.user_id).then((user) => {
        context.userSession = user;
        let libraries_promises = [];
        user.getPurchases().then((users_libraries) => {
            for (let i = 0 ; i < users_libraries.length ; i++){
                libraries_promises.push(user_library_model.User_Library.fromResult(users_libraries[i]).getLibrary());
            }
            Promise.all(libraries_promises).then((libraries) => {
                context.libraries = libraries;
                res.render('libraries/history.html.twig' , context);
            })
            .catch((err) => {
                console.log(err);
                res.render('404.html.twig' , context);
            });
        })
        .catch((err) => {
            console.log(err);
            res.render('404.html.twig' , context);
        });
    })
    .catch((err) => {
        console.log(err);
        res.render('404.html.twig' , context);
    }); 
});

module.exports = app;