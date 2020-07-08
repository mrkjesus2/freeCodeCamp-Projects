/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose')
var Book = require('../models/book')

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection

db.on('error', (err) => {
  console.log('Database Error:', err)
})
db.on('open', () => {
  console.log('We have a database')
})

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        res.json(books)
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;

      Book.findOne({_id: bookid}, (err, book) => {
        if (err) {
          res.status(400).send('no book exists')
        }
        res.json(book)
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
