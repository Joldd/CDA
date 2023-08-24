const mysql = require('mysql');

var con = mysql.createConnection({
  host: "cda-db",
  user: "admin",
  password: "tempPassword1234!",
  database: "db"
});

class User {
    constructor(){
      this.id;
      this.name = "";
      this.email = "";
      this.password = "";
      this.salt = "";
      this.mailIsConfirmed = false;
      this.image = "";
      this.description = "";
      this.societyAdress = "";
      this.siren = null;
      this.paypalAdress = "";
      this.kbis = "";
    }
  
    static fromResult(result){
      let user = new User();
      user.id = result.id;
      user.name = result.name;
      user.email = result.email;
      user.password = result.password;
      user.salt = result.salt;
      user.mailIsConfirmed = result.mailIsConfirmed;
      user.image = result.image;
      user.description = result.description;
      user.societyAdress = result.societyAdress;
      user.siren = result.siren;
      user.paypalAdress = result.paypalAdress;
      user.kbis = result.kbis;
      return user;
    }
  
    static findByMail(email){
      return new Promise((resolve, reject) => {
        con.query(
          `SELECT * FROM users WHERE email = ?;`
          ,
          [
            email
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(User.fromResult(result[0]));
          }
        );
      });
    }

    static findById(id){
      return new Promise((resolve, reject) => {
        if (id == null){
          return reject("No user connected");
        }
        con.query(
          `SELECT * FROM users WHERE id = ?;`
          ,
          [
            id
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(User.fromResult(result[0]));
          }
        );
      });
    }
  
    create(){
      return new Promise(() => {
        con.query(
          `INSERT INTO users(
            name,
            password,
            salt,
            email,
            mailIsConfirmed,
            image,
            description,
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
          (function (err, result) 
          {
            if (err) throw err;
            else {
              this.id = result.insertId;
              resolve(this);
              console.log("User created");
            }
          }).bind(this)
        );
      });
    }
  
    update(){
      con.query(
        `UPDATE users
        SET name = ?,
        email = ?,
        password = ?,
        salt = ?,
        mailIsConfirmed = ?,
        image = ?,
        description = ?,
        societyAdress = ?,
        siren = ?,
        paypalAdress = ?,
        kbis = ?
        WHERE id = ?;`
        ,
        [
          this.name,
          this.email,
          this.password,
          this.salt,
          this.mailIsConfirmed,
          this.image,
          this.description,
          this.societyAdress,
          this.siren,
          this.paypalAdress,
          this.kbis,
          this.id
        ]
        , 
        function (err, result) 
        {
          if (err) throw err;
          else console.log("User maj");
        }
      );
    } 

    getLibraries(){
      return new Promise((resolve, reject) => { 
        con.query(
          `SELECT * FROM libraries
          WHERE owner_id = ?;`
          ,
          [
            this.id
          ]
          , 
          function (err, result) 
          {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    } 
  }

  module.exports = {User};