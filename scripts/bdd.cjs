const mysql = require('mysql');

var con = mysql.createConnection({
    host: "cda-db",
    user: "admin",
    password: "tempPassword1234!",
    database: "db"
  });

class Account {
    constructor(email, password){
        this.name = "";
        this.email = email;
        this.password = password;
        this.salt = "";
        this.mailIsConfirmed = false;
        this.image = "";
        this.description = "";
        this.societyAdress = "";
        this.siren = null;
        this.paypalAdress = "";
        this.kbis = "";
    }

    create(){
        con.query(
            `INSERT INTO account(
              name,
              password,
              salt,
              email,
              mailIsConfirmed,
              image,
              Description,
              societyAdress,
              siren,
              paypalAdress,
              kbis)
              VALUES(?,?,?,?,?,?,?,?,?,?,?)`
            ,
            [
              this.name, 
              this.password, 
              this.salt, 
              this.email, 
              this.mailIsConfirmed, 
              this.image, 
              this.description, 
              this.societyAdress, 
              this.siren, 
              this.paypalAdress, 
              this.kbis
            ]
            , 
            function (err, result) 
            {
              if (err) throw err;
              console.log("Account created");
            }
          );
    }
}

module.exports = {Account};