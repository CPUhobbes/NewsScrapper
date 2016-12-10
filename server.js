//NPM Packages
var express = require('express');
var app = express();
var request = require("request-promise");
var cheerio = require('cheerio');
var bodyParser = require('body-parser')
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

//Setup Handlebars engine and bodyParser with express
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
	extended: false
}));

//Mongoose Schema
var Article = require("./models/articleModel.js");

//Mongoose Connection
mongoose.connect('mongodb://heroku_4k444lsz:f961utl3kai6g3l3sg05mka8vh@ds127948.mlab.com:27948/heroku_4k444lsz');

//mongoose.connect('mongodb://localhost/news_scrapper');
var db = mongoose.connection;

//Parses all the html from webpage and then adds to database
function parsePage(html, siteRoot) {
    
    var $ = cheerio.load(html);

    //Parse html data
    $('div.story-content').each(function(i, element) {
        var dataElem = {
            title: $(element).find('h3.story-title').text(),
            byline: $(element).find('p').html(),
            url: siteRoot + $(element).find('h3.story-title').find('a').attr('href')
        }

        //Check to see if same article exists in database and add it if it doesn't exist
        Article.update({ "title": dataElem.title.trim()},{$setOnInsert: dataElem},{upsert: true}, function(err, results) {
            if (err) {
                console.log(err);
            }
        });
    });
}

app.get('/', function(req, res) {

    var siteRoot = "http://www.reuters.com/news/archive/technologyNews";
    request(siteRoot, function(error, response, html) {

        //Parse html
        parsePage(html, siteRoot); 

    }).then(function(){

        //Get all articles in DB and send results as handlebars object
        Article.find({}).exec(function(error, results) {
            var data = { articles: results };
            res.render('index', data);
        });
    });
});

//Add comments to database
app.put("/comment/:id", function(req, res) {
	Article.findByIdAndUpdate(req.params.id, {$push: {comments: {title: req.body.title, body: req.body.body }}},
		{safe: true, upsert: true, new : true},
        function(err, model) {
        	if(err){
            	console.log(err);
        	}
        	Article.findOne({_id: req.params.id}, 
		
	        	function(err, result) {
	        		if(err){
	            		console.log(err);
	        		}
	        		res.json(result.comments);
	        	}
        	);
       	}
    );

});

//Delete comment from database
app.delete("/comment/:id/", function(req, res) {
	Article.findByIdAndUpdate(req.params.id, {$pull: { comments: {title:req.body.title}}}, { new: true }, 
	    function(err, result) {
	        if(err){
        		console.log(err);
        		res.json({});
    		}
    		res.json(result.comments);

    	}
	);
});

//Get all comments from database
app.get("/comment/:id", function(req, res) {
	Article.findOne({_id: req.params.id}, 
		
	    function(err, result) {
	        if(err){
        		console.log(err);
    		}
    		if(result.comments){
    			res.json(result.comments);
    		}
    		else{
    			res.json({})
    		}
    	}
	);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT);
