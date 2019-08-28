/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');

require('dotenv').config()

const URL = process.env.DB;

function validate(req) {
  const schema = {
    title : Joi.string().min(3).max(50).required()
  };
  return Joi.validate(req, schema);
}

async function connect() {
  const db = await MongoClient.connect(URL)
  return db.collection('books');
}

const newError = (message, status) => { 
  const error = new Error(message); 
  error.status = status; 
  return error
}

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const collection = await connect();
        let books = await collection.find().toArray()

        books = books.map(elm => {
          elm.commentcount = elm.comments.length
          delete elm.comments;
          return elm
        })
        res.json(books);
        
      } catch(err) {
        res.json(err)
      }
    })
    
    .post(async (req, res, next) => {
      try{
        const {title} = req.body;
        if(!title) return next(newError('missing title', 400));

        const { error } = validate({title});
        if (error) return next(newError(error.details[0].message, 400));

        const collection = await connect();

        const doc = {title:title, comments:[]};
        const book = await collection.insert(doc)

        if(!book) return next(newError('sorry could not add book. try again! thanks', 400))
        res.json({success: true, book: book.ops[0], message: 'Book successfully added'});
        
      } catch(err) {
        res.json(err)
      }
    })
    
    .delete(async (req, res, next) => {
      try {
        const collection = await connect();
        const drop = await collection.drop();

        if (!drop) return next(newError('sorry could not delete all book. try again! thanks', 400));
        res.json({success: true, message: 'complete delete successful'});

      } catch(err) {
        res.json(err)
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res, next) => {
      try {
        let {id} = req.params;

        if(!id) return next(newError('please enter an id.', 400));
        id = new ObjectId(id); 

        const collection = await connect();
        const book = await collection.find({_id:id}).toArray()
        
        if(book.length === 0) return next(newError('no book exists', 400));
        res.json({success: true, book: book[0]});
        
      } catch(err) {
        res.json(err)
      }
    })
    
    .post(async (req, res, next) => {
      try {
        const {comment} = req.body;
        let {id} = req.params;

        if(!id || !comment) return next(newError('please enter an id and comment', 400));
        id = new ObjectId(id);

        const collection = await connect();
        const updatedBook = await collection.findAndModify(
          {_id: id},
          {},
          {$push: { comments: comment }},
          {new: true, upsert: false}
        )
        if(!updatedBook) return next(newError('sorry could not add comment. try again! thanks', 400))  
        res.json({success: true, book: updatedBook.value, message: 'Comment successfully added'});

      } catch(err) {
        res.json(err)
      }
    })
    
    .delete(async (req, res, next) => {
      try {
        let {id} = req.params;

        if(!id) return next(newError('please enter an id', 400));
        id = new ObjectId(id); 

        const collection = await connect();
        const deletedBook = collection.findOneAndDelete({_id:id})

        if (!deletedBook) return next(newError('could not delete '+ id, 400));
        res.json({success: true, message: 'delete successful'})

      } catch(err) {
        res.json(err)
      }
    });
  
};
