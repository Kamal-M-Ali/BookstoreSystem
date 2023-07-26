import './Order.css';
import Card from "../Card";

export default function Order(props)
{
    return (
        <Card className='order'>
            <div className='order-details'>
                <div className='order-header'>
                    <h3>Order ID: {props.id} | </h3>
                    <h3>Status: {props.status} | </h3>
                    <h3>Purchased: {props.date} | </h3>
                    <h3>Total: ${props.total}</h3>
                </div>

                <div className='order-info'>
                    <div>
                        <h2>Order Address</h2>
                        <p>{props.address.street}</p>
                        <p>{props.address.city}, {props.address.state} {props.address.zipcode}</p>
                    </div>
    
                    <div>
                        <h2>Order Payment Card</h2>
                        <p>**** **** **** {props.paymentCard.lastFour}</p>
                    </div>

                </div>
            </div>
            
            <div className='order-books'>
                {props.books.map((book, k)=>
                <div key={k} className='order-book'>
                    <img src={book.coverURL} alt={book.title} className='order-cover-img'/>
                </div>
                )}
            </div>
        </Card>
    );
}
