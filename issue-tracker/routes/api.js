/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var Project = require('../models/project');
const mongoose = require('mongoose');

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
        if (err) {
          res.send('There was a problem getting the project')
          return
        }
        
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
      // TODO: Why is this allowing duplicate issues
      let projectName = req.params.project
      
      if (req.body.issue_title.length < 1 &&
          req.body.issue_text.length < 1 &&
          req.body.created_by < 1) {
            res.send('Missing required fields')
            return
          }

      Project.find({name: projectName}, (err, doc) => {
        if (err) {
          console.error(err)
          res.sendStatus(500)
          retun
        }
        
        let issues = {
          'issue_title': req.body.issue_title,
          'issue_text': req.body.issue_text,
          'created_by': req.body.created_by,
          'assigned_to': req.body.assigned_to,
          'status_text': req.body.status_text,
          'created_on': new Date(),
          'updated_on': new Date(),
          'open': true
        }
        
        if (doc.length > 0) {
          doc[0].issues.push(issues)
          
          doc[0].save((err, doc) => {
            if (err) {
              // TODO: Send 500 - Fix in tests
              res.send('There was a problem saving the issue')
              return
            }
            res.json(doc.issues[doc.issues.length - 1])
          })
        } else {
          let project = new Project({
            name: projectName,
            issues: issues
          })
    
          project.save((err, doc) => {
            if (err) console.log(err)
            res.json(doc.issues)
          })
        }
      }) 
    })
    
    .put(function (req, res) {
      var project = req.params.project;
      let objKeys = Object.keys(req.body)
      
      if ( !objKeys.includes('_id') ) {
        res.send('no updated field sent')
        return
      }

      Project.findOne({name: project}, (err, doc) => {
        let issue = doc.issues.id(req.body._id)
        let updatedIssue = {}

        for (let prop in issue) {
          prop = 'updated_on'
            ? updatedIssue[prop] = new Date()
            : objKeys.includes(prop)
              ? updatedIssue[prop] = req.body[prop]
              : updatedIssue[prop] = issue[prop]
        } 

        doc.save((err, doc2) => {
          if (err) {
            res.send('could not update ' + req.body._id)
            return
          }
          res.send('successfully updated')
        })
      })
    })
    
    .delete(function (req, res){
      let issueId = req.body._id
      let handleError = () => {
        // TODO: Send 500 - Fix in tests
        res.send('could not delete ' + issueId)
        return
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
