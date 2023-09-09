const {
    Router
} = require('express');
const app = Router();
const {
    v4: uuidv4
} = require('uuid');

const library_model = require("../Models/library_model.cjs");
const user_model = require("../Models/user_model.cjs");
const user_library_model = require("../Models/user_library_model.cjs");
const credit_model = require("../Models/credit_model.cjs");
const {
    con
} = require('../bdd.cjs');

app.get('/libraries', (req, res) => {
    let context = {};
    user_model.User.findById(req.session.user_id).then((user) => {
            if (user.type == 1) {
                context.userSession = user;
                user.getLibraries().then((libraries) => {
                        context.libraries = libraries;
                        res.render("forms/libraries.html.twig", context);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.render('forms/libraries.html.twig', context);
                    });
            }
            else {
                res.render("404.html.twig", context);
            }

        })
        .catch(() => {
            res.render('404.html.twig', context);
        });
});

app.post('/newLibrary', (req, res) => {
    let context = {};
    console.log(req.session.user_id);
    user_model.User.findById(req.session.user_id).then((user) => {
            let library = new library_model.Library();
            library.owner_id = user.id;
            library.title = req.body.title;
            library.price = req.body.price;
            library.type = req.body.type;
            let uploadedLibrary = req.files.library;
            library.uuid = uuidv4();
            let uploadLibraryPath = "media/libraries/" + library.uuid + ".lib";
            uploadedLibrary.mv(uploadLibraryPath, function (err) {
                if (err) {
                    console.log(err);
                    console.log("Failed !!");
                } else console.log("Successfully Uploaded !!");
            });
            let uploadedImage = req.files.image;
            library.image = uuidv4();
            let uploadImagePath = "media/img/" + library.image + ".png";
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
            res.render('404.html.twig', context);
        });
});

app.get('/', (req, res) => {
    let context = {};
    library_model.Library.getAllAccepted().then((librariesResult) => {
            let owner_promises = [];
            for (i=0;i<librariesResult.length;i++){
                owner_promises.push(library_model.Library.fromResult(librariesResult[i]).getOwner());
            }
            Promise.all(owner_promises).then((ownersResult) => {
                for (i=0;i<librariesResult.length;i++){
                    let owner = user_model.User.fromResult(ownersResult[i]);
                    librariesResult[i].ownerName = owner.email; 
                }
                context.libraries = librariesResult;
                user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    res.render("libraries/store.html.twig", context);
                })
                .catch(() => {
                    res.render("libraries/store.html.twig", context);
                });
            })
            .catch((err) => {
                console.log(err);
                res.render("404.html.twig", context);
            });
        })
        .catch((err) => {
            context.message = "No libraries";
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    res.render("libraries/store.html.twig", context);
                })
                .catch(() => {
                    res.render("libraries/store.html.twig", context);
                });
        });
});

app.get('/store/:type', (req, res) => {
    let context = {};
    library_model.Library.getByType(req.params.type).then((libraries) => {
            context.libraries = libraries;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    res.render("libraries/store.html.twig", context);
                })
                .catch(() => {
                    res.render("libraries/store.html.twig", context);
                })
        })
        .catch((err) => {
            res.render("libraries/store.html.twig", context);
        });
});

app.get('/library/:uuid', (req, res) => {
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            library.getOwner().then((ownerResult) => {
                let owner = user_model.User.fromResult(ownerResult);
                library.ownerName = owner.email;
                context.library = library;
                user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    if (library.owner_id == user.id) {
                        context.myLibrary = true;
                        res.render("libraries/one.html.twig", context);
                    } else {
                        user_library_model.User_Library.checkPurchase(user.id, library.id).then((user_library_result) => {
                                if (user_library_result.length > 0) {
                                    context.owned = true;
                                    res.render("libraries/one.html.twig", context);
                                } else {
                                    res.render("libraries/one.html.twig", context);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                res.render("404.html.twig", context);
                            })
                    }
                })
                .catch(() => {
                    res.render("libraries/one.html.twig", context);
                });
            })
            .catch((err) => {
                console.log(err);
                res.render("404.html.twig", context);
            });  
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
});

app.get('/library/:uuid/modify', (req, res) => {
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    if (library.owner_id == user.id) {
                        res.render("libraries/modify.html.twig", context);
                    } else {
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
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    if (library.owner_id == user.id) {
                        context.myLibrary = true;
                        library.title = req.body.title;
                        library.price = req.body.price;
                        library.description = req.body.description;
                        library.update();
                        context.message = "Your library has been updated !";
                        context.color = "green";
                        res.render("libraries/one.html.twig", context);
                    } else {
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
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    if (library.owner_id == user.id) {
                        library.delete();
                        context.message = "Your library has been deleted !"
                        user.getLibraries().then((libraries) => {
                                context.libraries = libraries;
                                res.render("forms/libraries.html.twig", context);
                            })
                            .catch((err) => {
                                console.log(err);
                                res.render("404.html.twig", context);
                            })
                    } else {
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
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    if (user.type == 0) {
                        user.getCredits().then((creditsUser) => {
                                if (creditsUser.length >= library.price) {
                                    user_library_model.User_Library.checkPurchase(user.id, library.id).then((user_library_result) => {
                                            if (user_library_result.length <= 0) {
                                                library.getCredits(user.id).then((creditsSpent) => {
                                                        for (i = 0; i < creditsSpent.length; i++) {
                                                            credit_model.Credit.fromResult(creditsSpent[i]).delete();
                                                        }
                                                        let user_library = new user_library_model.User_Library();
                                                        user_library.user_id = user.id;
                                                        user_library.library_id = library.id;
                                                        user_library.create();
                                                        library.salesNumber++;
                                                        library.update();
                                                        res.redirect("/library/" + library.uuid);
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                        res.render("404.html.twig", context);
                                                    })
                                            } else {
                                                res.render("libraries/one.html.twig", context);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.render("404.html.twig", context);
                                        })
                                } else {
                                    context.message = "No enough credits !";
                                    context.color = "red";
                                    res.render("libraries/one.html.twig", context);
                                }
                            })
                            .catch(() => {
                                res.render("404.html.twig", context);
                            });
                    } else {
                        context.message = "You need an user account to buy libraries !";
                        context.color = "red";
                        res.render("libraries/one.html.twig", context);
                    }

                })
                .catch(() => {
                    res.redirect("/login");
                });
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
});

app.get('/library/:uuid/download', (req, res) => {
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    user_library_model.User_Library.checkPurchase(user.id, library.id).then((user_library) => {
                            if (user_library.length > 0) {
                                let path = "./media/libraries/" + library.uuid + ".lib";
                                res.download(path);
                            } else {
                                res.render("404.html.twig", context);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.render("404.html.twig", context);
                        })

                })
                .catch(() => {
                    res.render("404.html.twig", context);
                });
        })
        .catch(() => {
            res.render("404.html.twig", context);
        });
});

app.get('/library/:uuid/like', (req, res) => {
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    context.userSession = user;
                    user_library_model.User_Library.checkPurchase(user.id, library.id).then((user_library_result) => {
                            if (user_library_result.length > 0) {
                                let user_library = user_library_model.User_Library.fromResult(user_library_result[0]);
                                if (!user_library.liked) {
                                    library.encouragementsNumber++;
                                    library.update();
                                    user_library.liked = true;
                                    user_library.update();
                                    res.redirect("/libraries/history");
                                } else {
                                    library.encouragementsNumber--;
                                    library.update();
                                    user_library.liked = false;
                                    user_library.update();
                                    res.redirect("/libraries/history");
                                }
                            } else {
                                res.render("404.html.twig", context);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.render("404.html.twig", context);
                        })

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
    let context = {};
    user_model.User.findById(req.session.user_id).then((user) => {
            context.userSession = user;
            console.log(user);
            let libraries_promises = [];
            let purchaseDates = [];
            let liked = [];
            user.getPurchases().then((users_libraries) => {
                    for (let i = 0; i < users_libraries.length; i++) {
                        purchaseDates.push(users_libraries[i].purchaseDate);
                        liked.push(users_libraries[i].liked);
                        libraries_promises.push(user_library_model.User_Library.fromResult(users_libraries[i]).getLibrary());
                    }
                    Promise.all(libraries_promises).then((libraries) => {
                            for (let i = 0; i < libraries.length; i++) {
                                libraries[i].purchaseDate = purchaseDates[i];
                                libraries[i].liked = liked[i];
                            }
                            context.libraries = libraries;
                            user.getCredits().then((credits) => {
                                    context.credits = credits;
                                    res.render('libraries/history.html.twig', context);
                                })
                                .catch((err) => {
                                    res.render('libraries/history.html.twig', context);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.render('404.html.twig', context);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    res.render('404.html.twig', context);
                });
        })
        .catch((err) => {
            console.log(err);
            res.render('404.html.twig', context);
        });
});

app.get('/manage', (req, res) => {
    let context = {};
    user_model.User.findById(req.session.user_id).then((user) => {
            if (user.type == 2) {
                context.userSession = user;
                let librariesValidating =[];
                let librariesAccepted =[];
                let librariesRejected =[];
                library_model.Library.getAll().then((libraries) => {
                    for(let i = 0 ; i<libraries.length ; i++){
                        let library = library_model.Library.fromResult(libraries[i]);
                        if (library.state == "validating"){
                            librariesValidating.push(library);
                        }
                        else if (library.state == "accepted"){
                            librariesAccepted.push(library);
                        }
                        else if (library.state == "rejected"){
                            librariesRejected.push(library);
                        }
                    }
                    context.librariesValidating = librariesValidating;
                    context.librariesAccepted = librariesAccepted;
                    context.librariesRejected = librariesRejected;
                    res.render("libraries/manage.html.twig",context);
                })
                .catch((err) => {
                    res.render("libraries/manage.html.twig",context);
                });
            }
            else {
                res.render("404.html.twig", context);
            }

        })
        .catch(() => {
            res.render('404.html.twig', context);
        });
});

app.get('/library/:uuid/manage/:state', (req, res) => {
    let context = {};
    library_model.Library.findByUuid(req.params.uuid).then((library) => {
            context.library = library;
            user_model.User.findById(req.session.user_id).then((user) => {
                    if (user.type == 2){
                        context.userSession = user;
                        library.state = req.params.state;
                        library.update();
                        res.redirect("/manage");
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

module.exports = app;