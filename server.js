var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user : 'sagarsachdev',
    database : 'sagarsachdev',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var articles = {
    'article-one' : {
        title : 'Article One | Sagar Sachdev',
        heading : 'Article One',
        date : 'sept 28 , 2016',
        content : `<p>
                This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.
            </p>
            <p>
                This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.
            </p>
            <p>
                This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.This is content for my first article.
            </p>`
    },
    'article-two' : {
            title : 'Article Two | Sagar Sachdev',
            heading : 'Article Two',
            date : 'sept 28 , 2016',
            content : `<p>
                This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.
                </p>
                <p>
                This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.
                </p>
                <p>
                This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.This is content for my second article.
                </p>`
    },
    'article-three' : {
        title : 'Article Three | Sagar Sachdev',
        heading : 'Article Three',
        date : 'sept 28 , 2016',
        content : `<p>
                This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.
                </p>
                <p>
                This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.
                </p>
                <p>
                This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.This is content for my third article.
                </p>`
    }
}
function createTemplate(data){
var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;

var htmlTemplate = `
<html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
        <div>
            <a href="/">Home</a>
        </div>    
        <hr />
        <h3>
            ${heading}
        </h3>
        <div>
            ${date}
        </div>    
        <div>
            ${content}
        </div>    
        </div>
    </body>    
</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.post('/create-user', function(req,res){
   // username, password
   // {"username" : "sagar","password" : "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1,$2)', [username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send("user successfully created: " + username);
        }        
    });
});

app.post('/login', function(req,res){
   var username = req.body.username;
   var password = req.body.password;

    pool.query('SELECT * FROM "user" where username = $1', [username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length === 0){
                res.send(403).send("username/password not found");
            }
            else{
                //Match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt); //creating a hash based on password submitted and the original salt
                if(hashedPassword === dbString){
                    res.send("credentials are correct!");
                }else{
                    res.send(403).send("username/password not found");
                }
            }
        }        
    });    
});


function hash (input, salt){
    // how do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString); 
});



var pool = new Pool(config);
app.get('/test-db', function(req,res){
    // make a select request
    // return a response with the results
    pool.query('SELECT * FROM test', function(err , result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

var counter = 0;
app.get('/counter', function(req,res){
    counter = counter + 1;
    res.send(counter.toString());
});

var names = [];
app.get('/submit-name',function(req,res){ //submit-name?name=xxxxx
   //Get the name from the request
   var name = req.query.name;
   
   names.push(name);
   //JSON : Javascript Object Notation
   res.send(JSON.stringify(names));
    
});

app.get('/articles/:articleName',function(req,res){
    // articleName == article-one
    // articles[articleName] == {} content object for article one
    
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'" , function(err, result){
       if(err){
           res.ststus(500).send(err.toString());
       } else{
           if(result.rows.length === 0){
               res.status(404).send('Article Not Found.');
           }else{
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
