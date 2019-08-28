import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

import AppTitle from './common/appTitle.jsx';
import {notifyInfo, notifyError, removeItemFromArr} from '../../helper';

const url = '/api/books/';


const FullBook = ({history, book, setBook, id}) => {

  const [deleteModal, setDeleteModal] = useState([]);
  
  
  useEffect(() => {
    
    fetch(url + id)
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      setBook([data.book])
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
    
    fetch(url + bookId, {
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
      
      history.push('/app')

    })
    .catch(error => console.error('Error:', error));

 }
  
  
 const cancelDelete = idx => {
    setDeleteModal(removeItemFromArr(deleteModal, idx))
 }
  
  
  return (

      <div className="board">
        <h2>Book infos</h2>

        <div className="books">

          {book[0] === undefined && <h3>Book not found.</h3>}

       
          {book[0] !== undefined && book.map((b, i) => {
            
            const comments = b.comments.map((comment, j) => (
              <div key={j} className="comment">
                
                <div className="comment-text">{comment}</div>
             
              </div>
            ))

            return (
              <div key={b._id}  className="book" >

                {deleteModal.includes(b._id) && showDeleteModal({bookId: b._id, bookIdx: i})}

                <button 
                  className="delete"
                  title="Delete Book"
                  onClick={() => setDeleteModal(deleteModal.concat(b._id))}
                >
                  <i className="far fa-trash-alt"></i>
                </button>

                <h3  className="book-title">{b.title}</h3>
                
                {comments[0] === undefined && <div className="comment-title">There are no comments yet.</div>}
                {comments[0] !== undefined && 
                  <React.Fragment>
                    <div className="comment-title">Comments:</div>
                    {comments}
                  </React.Fragment>
                }

              </div>
            )
          })}
          
        </div>
      </div>
    
  );
  
}


export default FullBook;