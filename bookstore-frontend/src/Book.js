import './Book.css';
import Card from './Card';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Book(props) {
    const API = "http://localhost:8080/api/cart-book/:";
    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;

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

    return (
        <Card className='book'>
            <img src={props.details.coverURL} alt={props.details.title} className='cover-img' />
            <h2 className='book-listing'>{props.details.title}<br />by: {props.details.author}<br />[{props.details.rating} / 5⭐]</h2>
            <h2 className='book-price'>${props.details.price}</h2>

            <span className='button-span'>
                <Link to={`/View/${props.details.isbn}`} state={{ book: props.details }}>
                    <button className='view-details-btn go-to-view'>View Details</button>
                </Link>
                <button className='view-details-btn to-cart' onClick={() => { handleCart(props.details) }}>Add to Cart</button>
            </span>

        </Card>
    );
}
