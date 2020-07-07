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
var Project = require('../models/project')


chai.use(chaiHttp);

before ('populateDB', async () => {
  let project = new Project({
    name: 'test project',
    issues:[
      {
        issue_title: 'Issue1',
        issue_text: 'whatever',
        created_by: 'Chai',
        assigned_to: 'Mocha',
        status_text: 'something'
      },
      {
        issue_title: 'Issue2',
        issue_text: 'what now',
        created_by: 'Chai',
        assigned_to: 'Chai',
        status_text: 'something else'
      },
      {
        issue_title: 'Issue3',
        issue_text: 'dont care',
        created_by: 'Mocha',
        assigned_to: 'Chai',
        status_text: 'something'
      }
     
    ]
  })

  await project.save(err => {
    if (err) throw err
    console.log('ITEM IN THE DATABASE')
  })
})

after('removeTestProject', async () => {
  const res = await Project.remove({name: 'test project'})
  console.log('REMOVED TEST ITEM', res.deletedCount)
})

let testObj
// console.log(server)
let postToServer = (obj, cb) => {
  return chai.request('http://localhost:3000/')
            .post('api/issues/test')
            .send(obj)
            .end(cb)
}

let putToServer = (obj, cb) => {
  return chai.request(server)
            .put('/api/issues/test')
            .send(obj)
            .end(cb)
}

let getFromServer = (obj, cb) => {
  return chai.request(server)
            .get('/api/issues/test project')
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
       postToServer(validReqObj, function(err, res){
          let resObj = res.body
          testObj = resObj

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
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        postToServer(validReqObj, function(err, res) {
          let resObj = res.body

          assert.equal(res.status, 200, 'res.status should be 200')
          assert.isOk(resObj.issue_title, 'issue_title should exist')
          assert.isOk(resObj.issue_text, 'issue_text should exist')
          assert.isOk(resObj.created_by, 'created_by should exist')
          done()
        })
      });
      
      test('Missing required fields', function(done) {
        postToServer(invalidResObj, function(err, res) {
          assert.equal(res.status, 200, 'res.status should not be 200')
          assert.equal(res.text, 'Missing required fields')
          done()
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server) // This be the problem
        putToServer({}, function(err, res) {
          assert.equal(res.text, 'no updated field sent', 'res.body should be: no updated field sent.')
          done()
        })
      });
      
      test('One field to update', function(done) {
        putToServer({
          _id: testObj._id,
          'issue_title': 'New IssueTitle'
        }, function(err, res) {
          assert.equal(res.status, 200, 'res.status should be 200')
          assert.equal(res.text, 'successfully updated')
          done()
        })
      });
      
      test('Multiple fields to update', function(done) {
        putToServer({
          _id: testObj._id,
          'issue_text': 'New issue Text',
          open: !testObj.open
        },
        (err, res) => {
          assert.equal(res.text, 'successfully updated')
          done()
        })
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
          created_by: 'Chai'
        },
        (err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.equal(res.body.length, 2)
          done()
        })
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        getFromServer({
          created_by: 'Chai',
          assigned_to: 'Chai'
        },
        (err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.equal(res.body.length, 1)
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
                if (err) console.log(err)
                // console.log('TEST', res)
                assert.equal(res.status, 200)
                assert.equal(res.text, 'id error')
                done()
            })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({_id: testObj._id})
            .end((err, res) => {
              if (err) console.log(err)
              assert.equal(res.status, 200)
              assert.equal(res.text, 'deleted ' + testObj._id)
              done()
            })
      });
      
    });

});
