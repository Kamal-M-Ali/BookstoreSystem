import './Cart.css';
import Navigation from '../Navigation';
import Card from '../Card';
import OrderItem from './OrderItem';
import { Link } from 'react-router-dom';

export default function Cart() {
    const dummy_data = [
        {
            title: "The Great Gatsby",
            desc: "This is a book description temporary placeholder.",
            genre: "Young Adult",
            author: "F-Scott Fitzgerald",
            cover: "https://s26162.pcdn.co/wp-content/uploads/2018/02/gatsby-original2.jpg",
            rating: 4.3,
            price: 7.99,
            isbn: "000-000"
        },
        {
            title: "Divine Rivals",
            desc: "This is a book description temporary placeholder.",
            author: "Rebecca Ross",
            cover: "https://storage.googleapis.com/du-prd/books/images/9781250857439.jpg",
            rating: 4.7,
            price: 17.99,
            isbn: "000-007"
        },
        {
            title: "Warrior Girl Unearthed",
            desc: "This is a book description temporary placeholder.",
            author: "Angeline Boulley",
            genre: "Young Adult",
            cover: "https://storage.googleapis.com/du-prd/books/images/9781250766588.jpg",
            rating: 4.6,
            price: 14.99,
            isbn: "000-010"
        }
    ]

    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;

    function countTotalPrice() {
        let price = 0;
        for (let i = 0; i < dummy_data.length; i++) {
            price += dummy_data[i].price;
        }
        return Math.round(price * 100) / 100;
    }

    return (<>
        <Navigation />
        <div className='cart-page'>
            <Card className='cart-items'>
                <h1 className='cart-h1'>Books</h1>
                <hr />
                <div className='order-display'>
                    {dummy_data.map((book, k) =>
                        <OrderItem key={k}
                            title={book.title}
                            author={book.author}
                            cover={book.cover}
                            rating={book.rating}
                            price={book.price}
                            isbn={book.isbn}
                            desc={book.desc}
                            genre={book.genre}
                        />
                    )}
                </div>
            </Card>
            <Card className='cart-total'>
                <h1 className='cart-h1'>Total</h1>
                <hr />
                <h2 className='cart-h2'>${countTotalPrice()}</h2>

                {loggedIn ?
                    <Link className='proceed-btn' to='/Checkout'>Checkout</Link>
                    :
                    <Link className='proceed-btn' to='/Login'>Login to Checkout</Link>
                }

            </Card>
        </div>
    </>);
}
