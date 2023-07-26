import './Featured.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Book from '../Book';

export default function Featured(props) {
    const [books, setBooks] = useState([]);

    function fetch() {
        axios
            .get('http://localhost:8080/api/books')
            .then((res) => {
                setBooks(res.data);
            })
            .catch((err) => {
                console.log('Error getting items');
            });
    }
    useEffect(fetch, []);

    return (
        <div className='featured-display'>
            {books.filter(
                book => book.bookType === props.cat).map((book, k) =>
                    <Book key={k} details={book}/>
                )}</div>
    );
}
