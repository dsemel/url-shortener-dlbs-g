

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//hbs = require('express-handlebars').create({defaultLayout:'main.hbs'}),
//app.engine('hbs', hbs.engine);
//app.set('view engine', 'jade');

app.set('view engine', 'ejs');

var shortid = require('shortid');

var UrlB = require('./routes/url.js');

var mongoose = require('mongoose');

var dotenv = require('dotenv');
dotenv.config();

var urlDB = process.env.MONGODB_URI;

var mongoLink = process.env.MONGO_DB_ATLAS;

//var localUrl = process.env.LOCAL_URL;

var localUrl = 'https://url-shortener-dlbs-g.herokuapp.com/';



var path = require('path');

var promise = mongoose.connect(mongoLink, {

   // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));



var port = process.env.PORT || 3000;



//http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response, err) {

    //response.sendFile(__dirname + '/views/index.html');
    if (err) {
        console.log(err);

    }

    response.render('index', {save_url: "", original_url: "", text1: ""});


});

app.post('/', function(request, response, err){

    if (err) {
        console.log(err);


    }


        var longUrl = request.body.save_url;



    if(!longUrl.match(/^[a-zA-Z]+:\/\//)){

        longUrl = 'https://' + longUrl;
    }



    var shortUrl = '';

    UrlB.findOne({long_url: longUrl}, function(err, doc){
        if(doc){

            shortUrl = localUrl +  doc.short_id;




            response.render('index', {save_url: shortUrl, original_url: longUrl, text1: "redirected from url below:"});


        }

        else {

            var newUrl = new UrlB({
                long_url:longUrl,
                short_id: shortid.generate(),
            });

            newUrl.save(function(err) {
                if(err){
                    console.log(err);
                }

                shortUrl = localUrl + newUrl.short_id;



                //response.send(shortUrl);
                //response.send({'shortUrl': shortUrl});
                response.render('index', {save_url: shortUrl, original_url: longUrl, text1: "redirected from url below:"});


            });
        }
    });


});


app.get('/:encoded_id', function(request, response,err) {

    if (err) {
        console.log(err);


    }

    var shortId = request.params.encoded_id;




        UrlB.findOne({short_id: shortId}, function (err, doc) {

            if(doc) {

                if (err) {

                    response.redirect(localUrl);

                }


                else {


                    response.redirect(doc.long_url);

                }
            }

        });



});







// listen for requests :)
var server = app.listen(port, function () {
    //var port = server.address().port;

    console.log('Your app is listening on port ' + port);
});


module.exports = app;