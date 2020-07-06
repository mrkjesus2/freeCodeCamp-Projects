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
        
      Project.findOne({name: project}, (err, doc) => {
        if (err) res.send('There was a problem getting the project')
        
        let issues = doc.issues.filter(issue => {
          let shouldReturn = true

          for (let prop in req.query) {
            if (issue[prop] !== req.query[prop]) {
              shouldReturn = false
            }
          }

          if (shouldReturn) {
            return issue
          }
        })
        res.json(issues)
      })
    })
    
    .post(function (req, res){
      let projectName = req.params.project
      // console.log(projectName)
      Project.find({name: projectName}, (err, doc) => {
        if (err) return err
        
        if (doc.length > 0) {
          // console.log('Found', doc[0].issues)
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
            // console.log('Created', doc.issues)
            res.json(doc.issues)
          })
        }
      })

      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      res.send('ok')
    })
    
    .delete(function (req, res){
      let issueId = req.body._id
      let handleError = () => {
        res.send('could not delete ' + issueId)
      }

      if (issueId) {
        Project.findOne({name: req.params.project},
          (err, project) =>{
            if (err) handleError()
            
            if (project.issues.length === 1) {
              // Delete the project if last issue
              Project.findByIdAndRemove(project._id, (err, doc) => {
                if (err) handleError()
                res.send('deleted ' + issueId)
              })
            } else {
              // Remove the issue
              project.issues.id(issueId).remove()
              project.save(err => {
                if (err) handleError
                res.send('deleted ' + issueId)
              })
            }
          });
      } else {
        res.send('id error')
      }
    });
    
};
