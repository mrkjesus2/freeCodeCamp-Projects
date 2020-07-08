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
    
    .post(function (req, res, next){
      var title = req.body.title;
      let book = new Book({title: title})
      
      if (!title) {
        res.status(400).send('title of book is required')
        return
      }

      book.save((err, doc) => {
        if (err) next(err)
        res.json(doc)
      })
    })
    
    .delete(function(req, res, next){
      Book.deleteMany({}, err => {
        if (err) next(err)
        res.send('complete delete successful')
      })
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
    
    .post(function(req, res, next){
      var bookid = req.params.id;
      var comment = req.body.comment;

      Book.findOne({_id: bookid}, (err, book) => {
        if (err) next(err)
        book.comments.push({comment: comment})

        book.save((err, doc) => {
          if (err) next(err)
          res.json(book)
        })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;

      Book.deleteOne({_id: bookid}, err => {
        if (err) next(err)
        res.send('delete successful')
      })
    });
  
};
