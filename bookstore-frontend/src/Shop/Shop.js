import './Shop.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Book from '../Book';
import Navigation from '../Navigation';

export default function Shop() {
    const [books, setBooks] = useState([]);
    const [sortedBooks, setSortedBooks] = useState(null);
    const [sortState, setSortState] = useState("title_s");
    const [checkState, setCheckState] = useState("title");

    function fetch() {
        axios
            .get('http://localhost:8080/api/books')
            .then((res) => {
                setBooks(res.data.sort((a, b) => a.title.localeCompare(b.title)));
            })
            .catch((err) => {
                console.log('Error getting items');
            });
    }
    useEffect(fetch, []);

    const sortResult = (e) => {
        setSortState(e);
        if (e === "title_s") {
            setSortedBooks(books.sort((a, b) => a.title.localeCompare(b.title)));
        }

        if (e === "priceh") {
            setSortedBooks(books.sort((a, b) => b.price - a.price));
        }

        if (e === "pricel") {
            setSortedBooks(books.sort((a, b) => a.price - b.price));
        }
    }

    const handleSearch = (e) => {
        var temp = null;
        if (checkState === "title") {
            temp = books.filter((el) => el.title.toLowerCase().includes(e.target.value.toLowerCase()));
        }

        if (checkState === "author") {
            temp = books.filter((el) => el.author.toLowerCase().includes(e.target.value.toLowerCase()));
        }

        if (checkState === "genre") {
            temp = books.filter((el) => el.category.toLowerCase().includes(e.target.value.toLowerCase()));
        }

        // Sort by
        if (sortState === "title_s") {
            temp = temp.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (sortState === "priceh") {
            temp = temp.sort((a, b) => b.price - a.price);
        }

        if (sortState === "pricel") {
            temp = temp.sort((a, b) => a.price - b.price);
        }

        setSortedBooks(temp);
    }

    return (<>
        <Navigation />
        <div className='search-container'>
            <input className='searchbar' type='text' placeholder='Search' onChange={handleSearch}></input>

            <div className='search-criteria'>
                <h3>Search by:</h3>
                <input type="radio" id="title" name="title" checked={checkState === "title"} onChange={(e) => setCheckState(e.target.id)} />
                <label htmlFor="title">Title</label>
                <input type="radio" id="author" name="author" checked={checkState === "author"} onChange={(e) => setCheckState(e.target.id)} />
                <label htmlFor="author">Author</label>
                <input type="radio" id="genre" name="genre" checked={checkState === "genre"} onChange={(e) => setCheckState(e.target.id)} />
                <label htmlFor="genre">Genre</label>


                <h3>Sort by:</h3>
                <input type="radio" id="title_s" name="sort" checked={sortState === "title_s"} onChange={(e) => sortResult(e.target.id)} />
                <label htmlFor="title_s">Title (a-z)</label>
                <input type="radio" id="priceh" name="sort" checked={sortState === "priceh"} onChange={(e) => sortResult(e.target.id)} />
                <label htmlFor="priceh">Price (high-low)</label>
                <input type="radio" id="pricel" name="sort" checked={sortState === "pricel"} onChange={(e) => sortResult(e.target.id)} />
                <label htmlFor="pricel">Price (low-high)</label>
            </div>
        </div>

        <div className='shop-display'>
            {(sortedBooks === null ? books : sortedBooks).map((book, k) =>
                <Book key={k} details={book}/>
            )}</div>
    </>);
}

