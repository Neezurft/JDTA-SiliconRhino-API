//var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
//const saltRounds = 10;

module.exports = function(app, db) {

  // TODO - Implement 
  // app.post('/event', (req, res) => {
  //     const event = {
  //         _id : req.body.id,
  //         id : req.body.id,
  //         time : req.body.time,
  //         creator : req.body.creator,
  //         guests : req.body.guests,
  //         type : req.body.type,
  //         location : req.body.location,
  //         comments : req.body.comments
  //     };

  //     db.collection("events").insert(event, (err, result) => {
  //         if (err) { 
  //             res.send({ 'error': err }); 
  //         } else {
  //             res.send(result.ops[0]);
  //         }
  //     });
  // });

  // app.delete('/events/:id', (req, res) => {
  //     const id = req.params.id;
  //     const details = { '_id': id };
  //     db.collection('events').remove(details, (err, item) => {
  //         if (err) {
  //         res.send({'error': err});
  //         } else {
  //         res.send('Event ' + id + ' deleted!');
  //         } 
  //     });
  // });

  // Sends a single event from db
  app.get('/events/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': id };

      db.collection('events').findOne(details, (err, item) => {
        if (err) {
          res.send({'error': err});
        } else {
          res.send(item);
        }
      });
  });

  // Sends an array of events, based on a search term that is applied to the title of events
  // stored in the db
  app.get('/events', (req, res) => {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);
      const search = req.query.search;

      db.collection('events').find({ "title" : {$regex : ".*"+search+".*", $options: 'i'}},{ _id : 0 })
      .sort({time : 1})
      .skip((page-1)*pageSize)
      .limit(pageSize)
      .toArray( (err, result) => {
        if (err) {
          res.send({'error': err});
        } else {
          res.send(result);
        }
      });
  });

  // Deletes a comment form an event
  app.put('/deleteComment', (req, res) => {
      const details = { '_id': req.body.id };
      const commentNum = parseInt(req.body.commentNum);

      db.collection('events').findOne(details, (err, event) => {
        if (err) {
          res.send({'success': false});
        } else {
          event.comments.splice(commentNum,1);                        
          db.collection('events').update(details, event, (err, result) => {
            if (err) {
                res.send({'success': false});
            } else {  
                res.send({'success' : true});
            } 
          }); 
        }
      });

  });

  // Adds a comment to an event
  app.put('/addComment', (req, res) => {
    const details = { '_id': req.body.id };
    const username = req.body.username;
    const imgUrl = req.body.imgUrl;
    const comment = req.body.comment;
    const timestamp = req.body.timestamp;

    db.collection('events').findOne(details, (err, event) => {
      if (err) {
        res.send({'error': err});
      } else {
        event.comments.push({
          "user": {
            "name": username,
            "avatarUrl": imgUrl
          },
          "timestamp": timestamp,
          "message": comment
        });
        
        db.collection('events').update(details, event, (err, result) => {
          if (err) {
              res.send({'error': err});
          } else {  
              res.send({'success' : 'comment added'});
          } 
        });            
      }
    });
  });

  // Verifies that the user is valid and is allowed to post comments
  app.get('/verifyUser', (req, res) => {
    const username = req.query.user;
    const password = req.query.pass;

    db.collection('users').findOne({'name' : username }, (err, user) => {
      if (err) {
        res.send({ valid : false});
      } else {
        if(user!=null){
          bcrypt.compare(password, user.pass, function(err, r) {
            if(r)
              res.send({
                valid : true,
                url : user.imgUrl
                });
            else 
              res.send({ valid : false});
          });
        } else {
          res.send({ valid : false});
        }   
      }
    });
    
  });

};