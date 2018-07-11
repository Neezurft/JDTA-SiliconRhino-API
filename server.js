const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const datab          = require('./config/db');

const app            = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true })); 

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