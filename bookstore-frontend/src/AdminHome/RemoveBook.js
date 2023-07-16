import '../Shop/Shop.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import BookEdit from './BookEdit';
import AdminMenu from './AdminMenu';

export default function Remove() 
{
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

    return (<>
    <AdminMenu />
    <div className='search-container'>
        <input className='searchbar' type='text' placeholder='Search'/>
    </div>
    <div className='shop-display'>
        {books.map((book, k)=>
        <BookEdit key={k}
            todo='Remove'
            title={book.title}
            author={book.author}
            cover={book.coverURL}
            rating={book.rating}
            price={book.price}
            isbn={book.isbn}
        />
    )}</div>
    </>);
}
