import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

import {notifyInfo, notifyError, formatDate, removeItemFromArr} from '../../helper';

const url = '/api/books';


const Books = ({books, setBooks}) => {

  
  const [deleteModal, setDeleteModal] = useState([]);
  
  
  useEffect(() => {
    
    fetch(url)
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      setBooks(data)
    })
    .catch(error => console.error('Error:', error));
    
  }, [])
  

  const showDeleteModal = ({bookId, bookIdx}) => {
    
    const modalIdx = deleteModal.indexOf(bookId);
  
    return (
       <div className="modal">
         <h3>Delete this Book?</h3>
         <button className="modal-btn" onClick={e => handleDelete({e, bookId, bookIdx})}>Delete</button>
         <button className="modal-btn" onClick={() => cancelDelete(modalIdx)}>Cancel</button>
       </div>
    );
  }
  
  const handleDelete = ({e, bookId, bookIdx}) => {
    
    const btn = e.target;
    btn.disabled = true;
    
    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({_id: bookId}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      btn.disabled = false;
      
      if(!data.success) return notifyError(data.error)
      
      notifyInfo(data.message)
      
      setBooks(removeItemFromArr(books, bookIdx))

    })
    .catch(error => console.error('Error:', error));

 }
  
  
 const cancelDelete = idx => {
    setDeleteModal(removeItemFromArr(deleteModal, idx))
 }
  
  
  return (
    <div className="board">
      <h2>All submitted Books</h2>
      
      <div className="books">

        {books[0] === undefined && <h3>No Books so far.</h3>}
        
        {books[0] !== undefined && books.map((book, i) => {

          return (
            <div key={book._id}  className="book" >

              {deleteModal.includes(book._id) && showDeleteModal({bookId: book._id, bookIdx: i})}

              <button 
                className="delete"
                title="Delete Book"
                onClick={() => setDeleteModal(deleteModal.concat(book._id))}
              >
                <i className="far fa-trash-alt"></i>
              </button>

              <h3  className="book-title">{book.title}</h3>
              
              <div className="thread-links">
                <a className="add-reply"  href={'/app/books/'+book._id}>Add a comment</a>
                <a className="see-thread" href={'/app/books/'+book._id}>See all comments</a>
              </div>
  
            </div>
          )
      })}
      </div>
    </div>
  );
  
}


export default Books;