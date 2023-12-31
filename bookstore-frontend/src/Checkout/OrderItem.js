import './OrderItem.css';
import Card from '../Card';
import axios from 'axios';

export default function OrderItem(props) {
    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;

    function handleIncrement() {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios.put("http://localhost:8080/api/cart-book/:" + email, props.details)
                .then((res) => {
                    props.updateQty();;
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    function handleDecrement() {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');
        if (email) {
            axios.post("http://localhost:8080/api/del-cart-book/:" + email, props.details)
                .then((res) => {
                    props.updateQty();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    return (
        <Card className='order-item'>
            <img src={props.details.coverURL} alt={props.details.title} className='order-cover-img' />
            <h2 className='order-book-listing'>{props.details.title} by: {props.details.author} [{props.details.rating} / 5⭐]</h2>
            <h2 className='order-book-price'>${props.details.price}</h2>
            <h2 className='order-book-qty'>Quantity: {props.quantity}</h2>

            {loggedIn &&
                <div className='confirm-checkout-btns'>
                    <button className='cart-btn add' onClick={handleIncrement}>Add</button>
                    <button className='cart-btn rm' onClick={handleDecrement}>Remove</button>
                </div>
            }
        </Card>
    );
}
