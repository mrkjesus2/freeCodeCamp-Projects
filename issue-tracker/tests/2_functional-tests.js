/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const { expect } = require('chai');

chai.use(chaiHttp);

let testObj

let postToServer = (obj, cb) => {
  return chai.request(server)
            .post('api/issues/test')
            .send(obj)
            .end(cb)
}

let getFromServer = (obj, cb) => {
  return chai.request(server)
            .get('api/issues/test')
            .query(obj)
            .end(cb)
}

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      let validReqObj = {
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      }

      let invalidResObj = {
        issue_title: '',
        issue_text: '',
        created_by: '',
        assigned_to: '',
        status_text: ''
      }

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send(validReqObj)
        .end(function(err, res){
          let resObj = res.body[0]
          console.log(resObj)

          assert.equal(res.status, 200);
          assert.equal(resObj.issue_title, validReqObj.issue_title, 'issue_title should match' )
          assert.equal(resObj.issue_text, validReqObj.issue_text, 'issue_text should match' )
          assert.equal(resObj.created_by, validReqObj.created_by, 'created_by should match' )
          assert.equal(resObj.assigned_to, validReqObj.assigned_to, 'assigned_to should match' )
          assert.equal(resObj.status_text, validReqObj.status_text, 'status_text should match' )

          assert.isOk(resObj.created_on, 'created_on should exist')
          assert.isOk(resObj.updated_on, 'updated_on should exist')

          assert.isBoolean(resObj.open, 'open should be a boolean')
          assert.isOk(resObj._id, '_id should exist')
          assert.isString(resObj._id)

          testObj = resObj
         done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send(validReqObj)
          .end(function(err, res) {
            let resObj = res.body

            assert.equal(res.status, 200, 'res.status should be 200')
            assert.isOk(resObj.issue_title, 'issue_title should exist')
            assert.isOk(resObj.issue_text, 'issue_text should exist')
            assert.isOk(resObj.created_by, 'created_by should exist')
            done()
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('api/issues/test')
          .send(invalidResObj)
          .end(function(err, res) {
            assert.notEqual(res.status, 200, 'res.status should not be 200')
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .post('api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.body, 'no updated field sent.', 'res.body should be: no updated field sent.')
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .post('api/issues/test')
          .send({
            _id: testObj._id,
            'issue_title': 'New IssueTitle'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, 'res.status should be 200')
            assert.equal(res.body, 'Successfully updated')
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        postToServer({
          _id: testObj._id,
          'issue_text': 'New issue Text',
          open: !testObj.open
        },
          (err, res) => {
            assert.equal(res.body, 'Successfully updated')
            done()
          }
        )
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        getFromServer({
          open: testObj.open
        },
          (err, res) => {
            assert.equal(res.status, 200)
            // More here
            done()
          })
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        getFromServer({
          id: testObj._id,
          open: testObj.open
        },
          (err, res) => {
            assert.equal(res.status, 200)
            // More here
            done()
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200)
              done()
            })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
            .delete('api/issues/test')
            .send({id: testObj._id})
            .end((err, res) => {
              assert.equal(res.status, 200)
              done()
            })
      });
      
    });

});
