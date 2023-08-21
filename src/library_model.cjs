const mysql = require('mysql');

var con = mysql.createConnection({
  host: "cda-db",
  user: "admin",
  password: "tempPassword1234!",
  database: "db"
});

class Library {
    constructor(){
      this.id;
      this.title = "";
      this.image = "";
      this.description = "";
      this.type = 'Scene';
      this.price = 0;
      this.state = 'validating';
      this.releaseDate = 0;
      this.salesNumber = 0;
      this.encouragementsNumber = 0;
      this.owner_id;
    }
  
    static fromResult(result){
      let library = new Library();
      library.id = result.id;
      library.title = result.title;
      library.image = result.image;
      library.description = result.description;
      library.type = result.type;
      library.price = result.price;
      library.state = result.state;
      library.releaseDate = result.releaseDate;
      library.salesNumber = result.salesNumber;
      library.encouragementsNumber = result.encouragementsNumber;
      library.owner_id = result.owner_id;
      return library;
    }

    static findById(id){
      return new Promise((resolve, reject) => {
        con.query(
          `SELECT * FROM libraries WHERE id = ?;`
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
        `INSERT INTO libraries(
          title,
          image,
          description,
          type,
          price,
          state,
          releaseDate,
          salesNumber,
          encouragementsNumber,
          owner_id)
          VALUES(?,?,?,?,?,?,?,?,?,?)`
        ,
        [
          this.title,
          this.image,
          this.description,
          this.type,
          this.price,
          this.state,
          this.releaseDate,
          this.salesNumber,
          this.encouragementsNumber,
          this.owner_id
        ]
        , 
        (function (err, result) 
        {
          if (err) throw err;
          this.id = result.insertId;
          console.log("Library created");
        }).bind(this)
      );
    }
  
    update(){
      con.query(
        `UPDATE libraries
        SET title = ?,
        image = ?,
        description = ?,
        type = ?,
        price = ?,
        state = ?,
        releaseDate = ?,
        salesNumber = ?,
        encouragementsNumber = ?,
        owner_id = ?
        WHERE id = ?;`
        ,
        [
          this.title,
          this.image,
          this.description,
          this.type,
          this.price,
          this.state,
          this.releaseDate,
          this.salesNumber,
          this.encouragementsNumber,
          this.owner_id,
          this.id
        ]
        , 
        function (err, result) 
        {
          if (err) throw err;
          console.log("Library maj");
        }
      );
    } 
  }

  module.exports = {Library};