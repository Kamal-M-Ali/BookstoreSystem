import './AddBook.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import Card from '../Card';

export default function AddBook() {
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);

    function addBook(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios.put("http://localhost:8080/api/admin/add-book/:" + email, {
                title: e.target.title.value,
                category: e.target.genre.value,
                isbn: e.target.isbn.value,
                author: e.target.author.value,
                coverURL: e.target.cover.value,
                description: e.target.desc.value,
                bookType: e.target.bookType.value,
                rating: e.target.rating.value,
                price: e.target.price.value,
                inStock: e.target.qty.value,
                publisher: e.target.publisher.value,
                publicationYear: e.target.publicationYear.value
            }).then((res) => {
                if (res.status === 200) {
                    setConfirmOpen(true);
                }
            }).catch((err) => {
                console.log(err.response);
                alert("[Error]: Couldn't add book")
            })
        }
    }

    return (<>
        <AdminMenu />
        {(confirmOpen) ?
            <Card className='confirm-wnd'>
                <h1>Book Added</h1>
                <h2>The book was added to the system.</h2>
                <div className='confirm-btn'>
                    <button onClick={() => { setConfirmOpen(false); navigate('/Admin/ManageBooks/Add') }}>OK</button>
                </div>
            </Card>
            :
            <Card className='book-add-form'>
                <form onSubmit={addBook}>
                    <h2>Enter Book Details</h2>
                    <input type='text' name='title' placeholder='Title' required/>
                    <input type='text' name='isbn' placeholder='ISBN' required/>
                    <input type='text' name='genre' placeholder='Genre' required/>
                    <input type='text' name='author' placeholder='Author' required/>
                    <input type='text' name='cover' placeholder='Cover URL' required/>
                    <input type='text' name='bookType' placeholder='Book type [FEATURED, TOP_SELLER, or DEFAULT]' required/>
                    <input type='text' name='desc' placeholder='Description' required/>
                    <input type='number' step='0.1' max='5' min='0' name='rating' placeholder='Rating' required/>
                    <input type='number' step='0.01' min='0' name='price' placeholder='Price' required/>
                    <input type='number' name='qty' placeholder='In stock' required/>
                    <input type='text' name='publisher' placeholder='Publisher' required/>
                    <input type='number' name='publicationYear' placeholder='Publication year' required/>

                    <div className='confirm-btn'>
                        <button type='submit'>Add Book</button>
                    </div>
                </form>
            </Card>
        }
    </>);
}
