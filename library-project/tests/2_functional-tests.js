/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let Book = require('../models/book')

chai.use(chaiHttp);

suite('Functional Tests', async function() {

let book
let queryServer = (obj, cb) => {
  chai.request(server)
      .get('/api/books/')
      .query(obj)
      .end(cb)
}

let postServer = (obj, cb) => {
  chai.request(server)
      .post('/api/books')
      .send(obj)
      .end(cb)
}

before(async () => {
  await Book.insertMany([
    {
      title: 'Book1',
      comments: []
    },
    {
      title: 'Book2',
      comments: []
    },{
      title: 'Book3',
      comments: []
    }
  ])
  .then(docs => {
    book = docs[0]
  })
  .catch(err => {
    console.error(err)
  })
})

after(() => {
  Book.deleteMany({}, (err) => {
    console.log('Deleted Test DB')
  })
})


  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let title = 'test title'

        postServer({title: title}, (err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.equal(res.body.title, title)
          assert.isOk(res.body._id)
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        postServer({title: ''}, (err, res) => {
          assert.equal(res.status, 400)
          assert.equal(res.text, 'title of book is required')
          assert.deepEqual(res.body, {})
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        queryServer('', (err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          res.body.forEach(book => {
            assert.isOk(book.title)
            assert.isOk(book._id)
            assert.isNumber(book.commentcount)
            assert.isArray(book.comments)
          })
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
            .get('/api/books/23')
            .end((err, res) => {
              assert.equal(res.status, 400)
              assert.equal(res.text, "no book exists")
              assert.deepEqual(res.body, {})
              done();
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        // queryServer({id: book._id}, (err, res) => {
        chai.request(server)
            .get('/api/books/' + book.id)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.body._id, book._id)
              assert.equal(res.body.title, book.title)
              assert.isArray(res.body.comments)
              assert.deepEqual(res.body.comments, book.comments)
              done();
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let comment = 'test comment'

        chai.request(server)
            .post('/api/books/' + book.id)
            .send({comment: comment})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isObject(res.body)
              assert.equal(res.body.title, book.title)
              assert.equal(res.body._id, book._id)
              assert.isArray(res.body.comments)
              assert.equal(res.body.comments[res.body.comments.length - 1].comment, comment)
              done();
            })
      });
      
    });

    suite('DELETE /api/books/', function(){
      
      test('Test DELETE /api/books/[id] => delete book/expect "delete successful"', function(done){
        chai.request(server)
            .delete('/api/books/' + book.id)
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'delete successful')
              done()
        })
      })

      test('Test DELETE /api/books/ => delete all books/expect "complette delete successful"', function(done){
        chai.request(server)
            .delete('/api/books/')
            .send()
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.text, 'complete delete successful')
                done()
              })
        })
    })

  });

});
