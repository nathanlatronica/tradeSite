const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const port = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render("homePage");
});

app.get('/signUp', (req, res) => {
    res.render("signUpPage");
});

app.post('/signUpUser',  async function(req, res) {
    let rows = await insertUser(req.body);
    res.render('homePage')
});

app.get('/logIn', (req, res) => {
    res.render("logInPage");
});

app.post('/logInUser', async function(req, res) {
    let rows = await logInUserDB(req.body);
    
    if(rows.length == 0) {
        res.render("logInPage")
    } else {
        res.render("feedPage");
    }
});


app.listen(port, () => {
    console.log("connected");
});

function insertUser(body){ // This function submits the user info to the DB like name, email, linkedIn....etc
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `INSERT INTO users
                         (username, password)
                          VALUES (?,?)`;
         
            let params = [body.name, body.pass];
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
  }

  function logInUserDB(body){ // This function submits the user info to the DB like name, email, linkedIn....etc
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM users
                       WHERE username =? AND password=?`;
         
            let params = [body.name, body.pass];
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
  }

function dbConnection(){
    let connection = mysql.createConnection({
      host: 'database-2.clpc6rpfxc90.us-west-1.rds.amazonaws.com',
      port: '3306',
      user: 'admin',
      password: 'jBt43!lmT56)a',
      database: 'my_db'
    })
  
    return connection
  }


  function dbSetup() {
    let connection = dbConnection();
  
    connection.connect();
  
    var createUsers = 'CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), PRIMARY KEY (id));'
    connection.query(createUsers, function (err, rows, fields) {
      if (err) {
        throw err
      }
  
    })

    connection.end();
}

dbSetup();