//var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.post('/event', (req, res) => {
        const event = {
            _id : req.body.id,
            id : req.body.id,
            time : req.body.time,
            creator : req.body.creator,
            guests : req.body.guests,
            type : req.body.type,
            location : req.body.location,
            comments : req.body.comments
        };

        db.collection("events").insert(event, (err, result) => {
            if (err) { 
                res.send({ 'error': err }); 
            } else {
                res.send(result.ops[0]);
            }
        });
    });    

    app.delete('/events/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': id };
        db.collection('events').remove(details, (err, item) => {
            if (err) {
            res.send({'error': err});
            } else {
            res.send('Event ' + id + ' deleted!');
            } 
        });
    });

    app.put('/events/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': id };
        const event = { text: req.body.body, title: req.body.title };
        db.collection('events').update(details, event, (err, result) => {
            if (err) {
                res.send({'error': err});
            } else {
                res.send(event);
            } 
        });
    });

};