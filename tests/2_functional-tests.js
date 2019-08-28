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

chai.use(chaiHttp);

suite('Functional Tests', function() {

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
        assert.property(res.body[0], 'commentcount', 'should contain commentcount');
        assert.property(res.body[0], 'title', 'should contain title');
        assert.property(res.body[0], '_id', 'should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let id;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'test book'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.book.title, 'test book');
          
            assert.isArray(res.body.book.comments, 'Comments should be an array');
          
            assert.property(res.body.book, 'comments', 'should have property comments');
            assert.property(res.body.book, 'title', 'should have property title');
            assert.property(res.body.book, '_id', 'should have property _id');

            done();
          });     
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'missing title');
          
            done();
          });       
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.isArray(res.body, 'response should be an array');
          
            assert.property(res.body[0], 'commentcount', 'should have property commentcount');
            assert.property(res.body[0], 'title', 'should have property title');
            assert.property(res.body[0], '_id', 'should have property _id');
          
            id = res.body[0]._id;
          
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/012345678901234567891234')
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'no book exists');
          
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+ id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.book._id, id);
          
            assert.isArray(res.body.book.comments, 'Comments should be an array');
          
            assert.property(res.body.book, 'comments', 'should have property comments');
            assert.property(res.body.book, 'title', 'should have property title');
            assert.property(res.body.book, '_id', 'should have property _id');
            
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+ id)
          .send({comment: 'test comment'})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.isArray(res.body.book.comments, 'Comments should be an array');
          
            assert.include(res.body.book.comments, 'test comment', 'Comments should include test comment');
          
            assert.property(res.body.book, 'comments', 'should have property comments');
            assert.property(res.body.book, 'title', 'should have property title');
            assert.property(res.body.book, '_id', 'should have property _id');
          
            done();
          });     
      });
      
    });

  });

});
