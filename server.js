var express = require('express');
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var data="";


app.get('/', function(req,res) {
  //handlebars requires an object to be sent to the index handlebars file
  var data={
    articles:[], 
    comments:[]

  };

data.articles.push({articleTitle:"Cool Story", articleBody:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ", articleLink:"http://www.google.com"});
data.articles.push({articleTitle:"Bad Story", articleBody:"Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ", articleLink:"http://www.google.com"});
data.articles.push({articleTitle:"Other Story", articleBody:"Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ", articleLink:"http://www.google.com"});

data.comments.push({commentTitle:"cool", commentBody:"im veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dol"});
data.comments.push({commentTitle:"Neat", commentBody:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore iquip ex ea commodo consequat. Duis aute irure dol"});

  res.render('index', data);
});


var port = 3000;
app.listen(port);
