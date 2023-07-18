import './Order.css';
import Card from "../Card";

export default function Order(props)
{
    return (
        <Card className='order'>
            <div className='order-details'>
                <div className='order-text'>
                    <h2>Order ID: {props.id} | </h2>
                    <h2>{props.date} | </h2>
                    <h2>Total: ${props.total}</h2>
                </div>
                <button className='order-btn user'>Reorder</button>
            </div>
            
            <div className='order-books'>
                {props.books.map((book, k)=>
                <div key={k} className='order-book'>
                    <img src={book.cover} alt={book.title} className='order-cover-img'/>
                </div>
                )}
            </div>
        </Card>
    );
}
