const tables = require("../bdd.cjs")

class User_Library {
  constructor(){
    this.id;
    this.user_id;
    this.library_id;
    this.purchaseDate;
  }

  static fromResult(result){
    let user_library = new User_Library();
    user_library.id = result.id;
    user_library.user_id = result.user_id;
    user_library.library_id = result.library_id;
    user_library.purchaseDate = result.purchaseDate;
    return user_library;
  }

  static findById(id){
    return new Promise((resolve, reject) => {
      tables.con.query(
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
    return new Promise((resolve, reject) => {
      tables.con.query(
        `INSERT INTO users_libraries(
          user_id,
          library_id)
          VALUES(?,?)`
        ,
        [
          this.user_id,
          this.library_id
        ]
        , 
        (function (err, result) 
        {
          if (err) reject(err);
          else{
            this.id = result.insertId;
            console.log("User_Library created");
            resolve(this);
          }
        }).bind(this)
      );
    });
  }

  getLibrary(){
    return new Promise((resolve, reject) => {
      tables.con.query(
        `SELECT * FROM libraries
        WHERE id = ?;`
        ,
        [
          this.library_id
        ]
        , 
        function (err, result) 
        {
          if (err) reject(err);
          else resolve(result[0]);
        }
      );
    });
  } 
}

module.exports = {User_Library};