import './OrderItem.css';
import Card from '../Card';

export default function OrderItem(props) {
    const key = 'jwtToken';
    let loggedIn = sessionStorage.getItem(key) || localStorage.getItem(key) || false;

    return (
        <Card className='order-item'>
            <img src={props.details.coverURL} alt={props.details.title} className='order-cover-img' />
            <h2 className='order-book-listing'>{props.details.title} by: {props.details.author} [{props.details.rating} / 5⭐]</h2>
            <h2 className='order-book-price'>${props.details.price}</h2>
            <h2 className='order-book-qty'>Quantity: 1</h2>

            {loggedIn &&
                <div className='confirm-checkout-btns'>
                    <button className='cart-btn add'>Add</button>
                    <button className='cart-btn rm'>Remove</button>
                </div>
            }
        </Card>
    );
}
