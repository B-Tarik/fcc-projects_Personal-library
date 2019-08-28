import React, {useState, useEffect} from 'react';

import {notifyInfo, notifyError} from '../../helper';

const url = '/api/books';


const SubmitBook = ({books, setBooks}) => {
  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const btn = e.target.lastChild
    btn.disabled = true
    
    var obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      if(!data.success) return notifyError(data.error)
      
      notifyInfo(data.message)
      setBooks([data.book, ...books])
      btn.disabled = false
        
    })
    .catch(error => console.error('Error:', error));
  }
  
  return (
    <div className="submit-book">
      <h3>Submit a book</h3>
      
      <div className="form-container">
        
          <form className="submit-book-form" onSubmit={handleSubmit}>
            
            <input className="form-title" type="text" name="title" placeholder="*Book Title" required/>
            <input className="form-submit" type="submit" value="Add Book"/>
            
          </form>
        
      </div>
      
    </div>
  );
  
}

export default SubmitBook;