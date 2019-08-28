import React, {useState, useEffect} from 'react';

import {notifyInfo, notifyError} from '../../helper';

const url = '/api/books';


const DeleteAllBooks = ({setBooks}) => {
  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    var obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    if(!(obj['title'].toLowerCase() === 'delete')) return notifyError('Type Delete to delete all books!')
    
    fetch(url, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      if(!data.success) return notifyError(data.error)
      
      notifyInfo(data.message)
      setBooks([])

      
    })
    .catch(error => console.error('Error:', error));
    
    
  }
  
  return (
    <div className="submit-book">
      <h3>Delete all books</h3>
      
      <div className="form-container">
        
          <form className="submit-book-form" onSubmit={handleSubmit}>
            
            <input className="form-title" type="text" name="title" placeholder="send DELETE to delete all books" required/>
            <input className="form-submit" type="submit" value="Delete all books"/>
            
          </form>
        
      </div>
      
    </div>
  );
  
}

export default DeleteAllBooks;