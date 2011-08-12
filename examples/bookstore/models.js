/** 
 * Module dependencies
 */

var mongoose = require('mongoose'),
    mongoose-admin = require('mongoose-admin');

/**
 * Schema definition
 */

var AuthorModel = {
  name: {type: String, required:true},
  bio:  {type: String}
};

var Author = new mongoose.Schema(AuthorModel);
mongoose.model('Author', Author);

var BookModel = {
  title         : {type: String, required:true},
  author        : {type: Author},
  isbn          : {type: String},
  publishedDate : {type: Date}
};

var Book = new mongoose.Schema(BookModel);
mongoose.model('Book', Book);

/**
 * Create the admin site on port 8001
 */
var admin = mongoose-admin.createAdmin('mongodb://localhost/bookstore', 8001);
admin.ensureUserExists('admin', 'my-secret-p@ssw0rd');
admin.registerModel('Author', AuthorModel, {list:['name'], sort['name']});
admin.registerModel('Book', BookModel, {list:['title', 'isbn'], sort['publishedDate']});

