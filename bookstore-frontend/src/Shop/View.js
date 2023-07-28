import './View.css';
import Card from '../Card';
import Navigation from '../Navigation';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function View(props)
{
    const API = "http://localhost:8080/api/cart-book/:";
    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;

    const { 
        book = {
            title : "Title",
            description : "This is a book description temporary placeholder.",
            author : "First Last",
            category : "Genre",
            coverURL : "",
            publisher : "publisher",
            publicationYear : 2010,
            inStock : 0,
            rating : 0.0,
            price : 0.00,
            isbn: "00"
        }
    } = useLocation().state;

    function handleCart(book) {
        if (loggedIn) {
            const email = localStorage.getItem('email') || sessionStorage.getItem('email');

            if (email) {
                axios.put(API + email, book)
                    .then((res) => {
                        // added to cart success
                    })
                    .catch((err) => {
                        console.log("Failed to add item to cart.");
                    })
            }
        } else {
            let cart = sessionStorage.getItem('cart');
            cart = (cart === null) ? [] : JSON.parse(cart);

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].book.title === book.title) {
                    cart[i].quantity += 1;
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                    return;
                }
            }

            cart.push({ book: book, quantity: 1 })
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    return (<>
    <Navigation/>
    <div className='view-page'>
        <Card className='view-details'>
            <h1>{book.title} [{book.rating} / 5⭐]</h1>
            <h2>By: {book.author}</h2>
            <hr className='top-hr'/>

            <p>{book.description}</p>
            <br/><br/>
            
            <p><b>Genre:</b> {book.category}</p>
            <p><b>ISBN:</b> {book.isbn}</p>
            <p><b>Publisher:</b> {book.publisher}</p>
            <p><b>Published:</b> {book.publicationYear}</p>
            <p><b>Quantity:</b> {book.inStock}</p>

            <hr className='top-hr bottom-hr'/>
            <h3>${book.price}</h3>
            <button onClick={()=>{handleCart(book)}}>Add to Cart</button>
        </Card>
        <div className='view-main'>
            <img src={book.coverURL} alt={book.title}></img>
        </div>
    </div>
    </>);
}
