const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const port = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async function (req, res) {
    let itemList = await get3Items();
    console.log(itemList);

    res.render("homePage", {"itemList": itemList});
});

app.get('/signUp', (req, res) => {
    res.render("signUpPage");
});

app.post('/signUpUser',  async function(req, res) {
    let rows = await insertUser(req.body);
    let itemList = await get3Items();

    res.render('homePage', {"itemList": itemList})
});

app.get('/logIn', (req, res) => {
    res.render("logInPage");
});

app.post('/logInUser', async function(req, res) {
    let rows = await logInUserDB(req.body);
    let itemList = await fillFeedPage(req.body);

    if(rows.length == 0) {
        res.render("logInPage")
    } else {
        var user = req.body.name
        res.render("feedPage", {"user": user, "itemList":itemList});
    }
});

app.post('/itemPost', function(req, res) {
    var user = req.body.name

    res.render("itemPostPage", {"user": user});
});

app.post('/insertItemPost', async function(req, res) {
    let rows = await insertItemPost(req.body);
    let itemList = await fillFeedPage(req.body);

    var user = req.body.name
    res.render("feedPage", {"user": user, "itemList":itemList});
});

app.post('/getItemInfo', async function(req, res) {
    let post = await getPost(req.body);
    let comments = await getPostComments(req.body);
    let activeUser = req.body.activeUser;

    res.render('itemInfoPage', {"post":post, "comments": comments, "activeUser":activeUser})
});

app.post('/postComment', async function(req, res) {
    let rows = await insertComment(req.body);
    let post = await getPost(req.body);
    let comments = await getPostComments(req.body);
    let activeUser = req.body.activeUser;

    res.render('itemInfoPage', {"post":post, "comments": comments, "activeUser":activeUser})
});

app.post("/searchItem", async function(req, res) {
    let itemList = await getSearchItems(req.body);
    let user = req.body.name;
    console.log("search for : ", req.body.search)
    console.log("search: ", itemList)
    
    res.render("feedPage", {"user": user, "itemList":itemList});
});

app.post("/refresh", async function(req, res) {
    let itemList = await fillFeedPage(req.body);
    let user = req.body.name
    res.render("feedPage", {"user": user, "itemList":itemList});
    
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

function insertItemPost(body){ // This function submits the user info to the DB like name, email, linkedIn....etc
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `INSERT INTO posts
                         (username, iName, iURL, iDes)
                          VALUES (?,?,?,?)`;
         
            let params = [body.name, body.iName, body.iURL, body.iDes];
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
        });//connect
    });//promise 
}

function get3Items(){ // This function gets 3 random posts to make the home page look better
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM posts
                       ORDER BY RAND() LIMIT 3`;
         
            conn.query(sql, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
}

function fillFeedPage(body){ // This function gets a bunch of item posts for the feed page that dont belong to that user
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM posts
                       ORDER BY RAND() LIMIT 60`;
            let params = [body.name]
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
}

function getPost(body){ // This function gets 3 random posts to make the home page look better
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM posts
                       WHERE id = ?`;
            
            let params = [body.id]
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
}

function getPostComments(body){ // This function gets 3 random posts to make the home page look better
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM comments
                       WHERE postId = ?`;
            
            let params = [body.id]
            conn.query(sql, params,  function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
         });//connect
     });//promise 
}

function insertComment(body){ // This function submits the user info to the DB like name, email, linkedIn....etc
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `INSERT INTO comments
                         (postId, username, comment)
                          VALUES (?,?,?)`;
         
            let params = [body.id, body.name, body.comment];
            conn.query(sql, params, function (err, rows, fields) {
               if (err) throw err;
               //res.send(rows);
               conn.end();
               resolve(rows);
            });
         
        });//connect
    });//promise 
}

function getSearchItems(body){ 
   
    let conn = dbConnection();
     return new Promise(function(resolve, reject){
         conn.connect(function(err) {
            if (err) throw err;       
            let sql = `SELECT * FROM posts
                       WHERE iName LIKE ?
                       ORDER BY RAND() LIMIT 18`;
            
            let params = [body.search]
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

    var createPosts = 'CREATE TABLE IF NOT EXISTS posts (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(50), iName VARCHAR(50), iURL VARCHAR(200), iDes VARCHAR(200), PRIMARY KEY (id));'
    connection.query(createPosts, function (err, rows, fields) {
      if (err) {
        throw err
      }
  
    })

    var createComments = 'CREATE TABLE IF NOT EXISTS comments (id INT NOT NULL AUTO_INCREMENT, postId SMALLINT, username VARCHAR(50), comment VARCHAR(250), PRIMARY KEY (id));'
    connection.query(createComments, function (err, rows, fields) {
      if (err) {
        throw err
      }
  
    })

    connection.end();
}

dbSetup();