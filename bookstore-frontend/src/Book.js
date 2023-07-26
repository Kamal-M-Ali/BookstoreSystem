import './Book.css';
import Card from './Card';
import { Link } from 'react-router-dom';

export default function Book(props)
{
    console.log(props);
    return (
        <Card className='book'>
            <img src={props.details.coverURL} alt={props.details.title} className='cover-img'/>
            <h2 className='book-listing'>{props.details.title}<br />by: {props.details.author}<br />[{props.details.rating} / 5⭐]</h2>
            <h2 className='book-price'>${props.details.price}</h2>

            <span className='buttonSpan'>
                <Link to={`/View/${props.details.isbn}`} state={{book: props.details}}>
                    <button className='view-details-btn'>View Details</button>
                </Link>
                <div className='addToCart'>
                    <button onClick={{}}>Add to Cart</button>
                </div>
            </span>

        </Card>
    );
}
