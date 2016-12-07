//NPM Packages
var express = require('express');
var app = express();
var request = require("request");
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
mongoose.connect('mongodb://localhost/news_scrapper');
var db = mongoose.connection;

//Parses all the html from webpage and then adds to database
function parsePage(html, siteRoot) {
    return Promise.try(function() {

        var $ = cheerio.load(html);

        //Parse html data
        $('div.story-content').each(function(i, element) {
            var dataElem = {
                title: $(element).find('h3.story-title').text(),
                byline: $(element).find('p').html(),
                url: siteRoot + $(element).find('h3.story-title').find('a').attr('href')
            }

            var entry = new Article(dataElem);

            //Check to see if same article exists in database
            return Article.find({ "title": dataElem.title.trim() }).exec(function(error, results) {
                if (results.length === 0) {

                    //save article to DB
                    entry.save(function(err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    });

}


app.get('/', function(req, res) {

    var siteRoot = "http://www.reuters.com/news/archive/technologyNews";
    request(siteRoot, function(error, response, html) {
        
        parsePage(html, siteRoot).then(function() {
        }).then(function() {
            //Get all articles in DB and send results as handlebars object
            return Article.find({}).exec(function(error, results) {
                var data = { articles: results };
                res.render('index', data);
            });
        });
    });
});

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

app.delete("/comment/:id/", function(req, res) {
	Article.findOneAndRemove({_id: req.params.id}, {title:req.body.title}, 
		
	    function(err, result) {
	        if(err){
        		console.log(err);
    		}
    		//res.json(result.comments);
    	}
	);
});

app.get("/comment/:id", function(req, res) {
	Article.findOne({_id: req.params.id}, 
		
	    function(err, result) {
	        if(err){
        		console.log(err);
    		}
    		res.json(result.comments);
    	}
	);
});




var port = 3000;
app.listen(port);
