import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

import AppTitle from './common/appTitle.jsx';
import FullBook from './fullBook.jsx';
import SubmitComment from './submitComment.jsx';


const url = '/api/books/';


const Book = ({history}) => {

  const [book, setBook] = useState([]);
  const [deleteModal, setDeleteModal] = useState([]);
  
  const arr = history.location.pathname.split('/')
  const id = arr[3];
  

  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Personal Library</h1>} />
      <FullBook history={history} book={book} setBook={setBook} id={id} />
      <SubmitComment book={book} setBook={setBook} id={id} />
      
    </div>
  );
  
}


export default Book;