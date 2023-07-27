import './Cart.css';
import Navigation from '../Navigation';
import Card from '../Card';
import OrderItem from './OrderItem';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const API = "http://localhost:8000/api/cart";
    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;
    const [cartItems, setCartItems] = useState([]);

    function fetchData() {
        if (loggedIn) {
            const email = localStorage.getItem('email') || sessionStorage.getItem('email');

            if (email) {
                axios.get(API + email)
                    .then((res) => {
                        setCartItems(res.data);
                    })
                    .catch((err) => {
                        console.log(err.response);
                        setCartItems([]);
                    })
            } else {
                setCartItems([]);
            }
        } else {
            const cart = sessionStorage.getItem('cart');
            setCartItems(cart === null ? [] : JSON.parse(cart));
        }
    }
    useEffect(fetchData, [loggedIn])

    function countTotalPrice() {
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
            price += cartItems[i].book.price;
        }
        return price;
    }

    return (<>
        <Navigation />
        <div className='cart-page'>
            {cartItems.length > 0 ?
                <Card className='cart-items'>
                    <h1 className='cart-h1'>Books</h1>
                    <hr />
                    <div className='order-display'>
                        {cartItems.map((cartItem, k) =>
                            <OrderItem key={k}
                                details={cartItem.book}
                                qty={cartItem.qty}
                            />)
                        }
                    </div>
                </Card>
                :
                <div className='no-cart-items'>
                    <h1>No items in cart</h1>
                </div>
            }

            {cartItems.length > 0 &&
                <Card className='cart-total'>
                    <h1 className='cart-h1'>Total</h1>
                    <hr />
                    <h2 className='cart-h2'>${countTotalPrice().toFixed(2)}</h2>

                    {loggedIn ?
                        <Link className='proceed-btn' to='/Checkout'>Checkout</Link>
                        :
                        <Link className='proceed-btn' to='/Login'>Login to Checkout</Link>
                    }
                </Card>
            }
        </div>
    </>);
}
