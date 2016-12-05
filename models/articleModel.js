var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title:  {type: String, trim: true},
  byline: {type: String, trim: true},
  url:   {type: String, trim: true},
  comments: [{ 
    title: {type: String, required:"Forgot Comment Title"},
    body: {type: String, required:"Forgot Comment Body"}
  }]
  
});

var Article = mongoose.model('Article', articleSchema);

module.exports=Article;