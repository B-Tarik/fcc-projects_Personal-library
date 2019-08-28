import React, {useState, useEffect} from 'react';

import {notifyInfo, notifyError} from '../../helper';

const url = '/api/books/';


const SubmitComment = ({book, setBook, id}) => {

  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const form = e.target;
    const btn = e.target.lastChild
    btn.disabled = true
    
    var obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    fetch(url + id, {
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
      setBook([data.book])
      btn.disabled = false
      form.reset()
      
    })
    .catch(error => console.error('Error:', error));
  }
  
  return (
    <div className="submit-book">
      <h3>Add a Comment</h3>
      
      <div className="form-container">
        
          <form className="submit-book-form" onSubmit={handleSubmit}>
            
            <input className="form-title" type="text" name="comment" placeholder="Comment here" required/>
            <input className="form-submit" type="submit" value="Submit"/>
            
          </form>
        
      </div>
      
    </div>
  );
  
}

export default SubmitComment;