const mysql = require('mysql');

var con = mysql.createConnection({
  host: "cda-db",
  user: "admin",
  password: "tempPassword1234!",
  database: "db"
});

class User_Library {
    constructor(){
      this.id;
      this.user_id;
      this.library_id;
    }
  
    static fromResult(result){
      let user_library = new User_Library();
      user_library.id = result.id;
      user_library.user_id = result.user_id;
      user_library.library_id = result.library_id;
      return user_library;
    }

    static findById(id){
      return new Promise((resolve, reject) => {
        con.query(
          `SELECT * FROM users_libraries WHERE id = ?;`
          ,
          [
            id
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(Library.fromResult(result[0]));
          }
        );
      });
    }
  
    create(){
      con.query(
        `INSERT INTO users_libraries(
          user_id,
          project_id)
          VALUES(?,?)`
        ,
        [
          this.user_id,
          this.project_id
        ]
        , 
        (function (err, result) 
        {
          if (err) throw err;
          this.id = result.insertId;
          console.log("User_Library created");
        }).bind(this)
      );
    }
  }

  module.exports = {User_Library};