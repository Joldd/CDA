const mysql = require('mysql');

var con = mysql.createConnection({
  host: "cda-db",
  credit: "admin",
  password: "tempPassword1234!",
  database: "db"
});

class Credit {
    constructor(){
      this.id;
      this.purchaseDate;
      this.validity = 2;
      this.price = 1;
      this.user_id;
    }
  
    static fromResult(result){
      let credit = new Credit();
      credit.id = result.id;
      credit.purchaseDate = result.purchaseDate;
      credit.validity = result.validity;
      credit.price = result.price;
      credit.user_id = result.user_id;
      return credit;
    }

    static findById(id){
      return new Promise((resolve, reject) => {
        con.query(
          `SELECT * FROM credits WHERE id = ?;`
          ,
          [
            id
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(Credit.fromResult(result[0]));
          }
        );
      });
    }
  
    create(){
      con.query(
        `INSERT INTO credits(
          validity,
          price,
          user_id)
          VALUES(?,?,?)`
        ,
        [
          this.validity,
          this.price,
          this.user_id
        ]
        , 
        (function (err, result) 
        {
          if (err) throw err;
          else {
            this.id = result.insertId;
            console.log("credit created");
          }
        }).bind(this)
      );
    }
  
    update(){
      con.query(
        `UPDATE credits
        SET purchaseDate = ?,
        validity = ?,
        price = ?,
        user_id = ?
        WHERE id = ?;`
        ,
        [
          this.purchaseDate,
          this.validity,
          this.price,
          this.user_id,
          this.id
        ]
        , 
        function (err, result) 
        {
          if (err) throw err;
          else console.log("credit maj");
        }
      );
    } 

    getUser(){
      return new Promise((resolve, reject) => { 
        con.query(
          `SELECT * FROM users
          WHERE user_id = ?;`
          ,
          [
            this.id
          ]
          , 
          function (err, result) 
          {
            if (err) reject(err);
            else resolve(Credit.fromResult(result[0]));
          }
        );
      });
    } 
  }

  function createMultiple(n, user_id){
    for (i = 0 ; i<n ; i++){
      let credit = new Credit();
      credit.user_id = user_id;
      credit.create();
    }
  }

  module.exports = {Credit, createMultiple};