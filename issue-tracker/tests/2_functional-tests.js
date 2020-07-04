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
          let resObj = res.body.json

          assert.equal(res.status, 200);
          expect(resObj.issue_title).to.equal(validReqObj.issue_title)
          expect(resObj.issue_text).to.equal(validReqObj.issue_text)
          expect(resObj.created_by).to.equal(validReqObj.created_by)
          expect(resObj.assigned_to).to.equal(validReqObj.assigned_to)
          expect(resObj.status_text).to.equal(validReqObj.status_text)

          expect(resObj.created_on).to.exist
          expect(resObj.updated_on).to.exist

          expect(resObj.open).to.be.a('boolean')
          expect(resObj._id).to.exist
          expect(resObj._id).to.be.a('string')

          testObj = resObj
         done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send(validReqObj)
          .end(function(err, res) {
            let resObj = res.body.json

            expect(res.status).to.equal(200)
            expect(resObj.issue_title).to.exist
            expect(resObj.issue_text).to.exist
            expect(resObj.created_by).to.exist
            done()
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('api/issues/test')
          .send(invalidResObj)
          .end(function(err, res) {
            assert.notEqual(res.status, 200)
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
            expect(res.body).to.equal('no updated field sent.')
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .post('api/issues/test')
          .send({
            _id: testObj._id,
            'issue-title': 'New IssueTitle'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(200)
            expect(res.body).to.equal('Successfully updated')
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        postToServer({
          _id: testObj._id,
          'issue-text': 'New issue Text',
          open: !testObj.open
        },
          (err, res) => {
            expect(res.body.to.equal('Successfully updated'))
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
            expect(res.status).to.equal(200)
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
            expect(res.status).to.equal(200)
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
              expect(res.status).to.not.equal(200)
              done()
            })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
            .delete('api/issues/test')
            .send({id: testObj._id})
            .end((err, res) => {
              expect(res.status.to.equal(200))
              done()
            })
      });
      
    });

});
