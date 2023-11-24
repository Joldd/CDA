const tables = require("../bdd.cjs")

class Library {
    constructor(){
      this.id;
      this.title = "";
      this.uuid = "";
      this.image = "";
      this.description = "";
      this.type = 'Scene';
      this.price = 0;
      this.state = 'validating';
      this.releaseDate;
      this.salesNumber = 0;
      this.encouragementsNumber = 0;
      this.owner_id;
    }

    static getAll(){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries;`
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }

    static getAllValidating(){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries WHERE state = 'validating';`
          ,
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }

    static getAllAccepted(){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries WHERE state = 'accepted';`
          ,
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }

    static getAllRejected(){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries WHERE state = 'rejected';`
          ,
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }
  
    static fromResult(result){
      let library = new Library();
      library.id = result.id;
      library.uuid = result.uuid;
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
        tables.con.query(
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

    static findByUuid(uuid){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries WHERE uuid = ?;`
          ,
          [
            uuid
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

    static getByType(type){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM libraries WHERE type = ?;`
          ,
          [
            type
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }
  
    create(){
      tables.con.query(
        `INSERT INTO libraries(
          title,
          uuid,
          image,
          description,
          type,
          price,
          state,
          salesNumber,
          encouragementsNumber,
          owner_id)
          VALUES(?,?,?,?,?,?,?,?,?,?)`
        ,
        [
          this.title,
          this.uuid,
          this.image,
          this.description,
          this.type,
          this.price,
          this.state,
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

    delete(){
      tables.con.query(
        `DELETE FROM libraries WHERE id = ?`
        ,
        [
          this.id
        ]
        , 
        (function (err, result) 
        {
          if (err) throw err;
          console.log("Library deleted");
        }).bind(this)
      );
    }
  
    update(){
      tables.con.query(
        `UPDATE libraries
        SET title = ?,
        uuid = ?,
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
          this.uuid,
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

    getCredits(user_id){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM credits WHERE user_id = ? LIMIT ?;`
          ,
          [
            user_id,
            this.price
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result);
          }
        );
      });
    }

    getOwner(){
      return new Promise((resolve, reject) => {
        tables.con.query(
          `SELECT * FROM users WHERE id = ?;`
          ,
          [
            this.owner_id
          ]
          , 
          function (err, result) 
          {
            if (err || result.length <= 0) reject(err);
            else resolve(result[0]);
          }
        );
      });
    }
  }

  module.exports = {Library};