var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/zoo';
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/animals', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {

        var query = client.query('SELECT * FROM animals;');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/animal', function(req, res) {
    var addAnimal = {
        aType: req.body.animalType,
        aQuantity: req.body.animalQuantity,
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO animals (animal_type, animal_quantity) VALUES ($1, $2,) RETURNING id",

            [addAnimal.aType, addAnimal.aQuantity],
            function (err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
    });

});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, 'server/public', file));
});

app.set('port', process.env.PORT || 5000);  // I killed port 3000 with control Z. I had to use 5000.
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
