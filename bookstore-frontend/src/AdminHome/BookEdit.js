import '../Book.css';
import Card from '../Card';
import { Link } from 'react-router-dom';

export default function Book(props)
{
    return (
        <Card className='book'>
            <img src={props.details.coverURL} alt={props.details.title} className='cover-img'/>
            <h2 className='book-listing'>{props.details.title} by: {props.details.author} [{props.rating} / 5⭐]</h2>
            <h2 className='book-price'>${props.details.price}</h2>

            <Link to={`/Admin/ManageBooks/${props.todo}Book/${props.isbn}`} book={props.details} state={{isbn: props.details.isbn, title: props.details.title}}>
                <button className='view-details-btn'>{props.todo} Book</button>
            </Link>
        </Card>
    );
}
