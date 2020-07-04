/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var Project = require('../models/project');
const mongoose = require('mongoose');
const project = require('../models/project');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'DB problem'))
db.once('open', function () {
  console.log('DB connected')
})

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      // console.log(Project.find(project))
    })
    
    .post(function (req, res){
      let projectName = req.params.project
      // console.log(projectName)
      Project.find({name: projectName}, (err, doc) => {
        if (err) return err
        
        if (doc.length > 0) {
          res.json(doc[0].issues)
        } else {
          let project = new Project({
            name: projectName,
            issues: {
              'issue_title': req.body.issue_title,
              'issue_text': req.body.issue_text,
              'created_by': req.body.created_by,
              'assigned_to': req.body.assigned_to,
              'status_text': req.body.status_text,
              'created_on': new Date(),
              'updated_on': new Date(),
              'open': true
            }
          })
    
          project.save((err, doc) => {
            if (err) console.log(err)
            res.json(doc.issues)
          })
        }
      })

      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;

      
    });
    
};
