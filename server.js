const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const datab          = require('./config/db');

const app            = express();

const port = process.env.PORT || 8000;

app
.use( bodyParser.urlencoded({ extended: true }) )
.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://embeddednotes.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);
});

MongoClient.connect(datab.url, { useNewUrlParser: true }, (err, database) => {
    if (err) {
        return console.log(err);
    }        
                        
    db = database.db("drinksapp_db")

    require('./app/routes')(app, db);

    app.listen(port, () => {
      console.log('We are live on ' + port);
    });               
  });