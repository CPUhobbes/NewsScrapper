//NPM Packages
var express = require('express');
var app = express();
var request = require("request");
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

//Setup Handlebars engine with express
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Mongoose Schema
var Article = require("./models/articleModel.js");

//Mongoose Connection
mongoose.connect('mongodb://localhost/news_scrapper');
var db = mongoose.connection;


app.get('/', function(req,res) {
  
  var siteRoot = "http://www.reuters.com/news/archive/technologyNews";
  request(siteRoot , function(error, response, html) {

    var $ = cheerio.load(html);

    //Parse html data
    $('div.story-content').each(function(i, element){
      var dataElem = {
        title: $(element).find('h3.story-title').text(),
        byline: $(element).find('p').html(),
        url: siteRoot + $(element).find('h3.story-title').find('a').attr('href')
      }
      
      //Create new article object
      var entry = new Article(dataElem);

      //Check to see if same article exists in database
      Article.find({"title":dataElem.title.trim()}).exec(function(error, results) {
        if(results.length === 0){

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

    //Get all articles in DB and send results as handlebars object
    Article.find({}).exec(function(error, results) {
      var data={ articles: results };
      res.render('index', data);
    });
  });
});

var port = 3000;
app.listen(port);
