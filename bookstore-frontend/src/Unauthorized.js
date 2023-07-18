import './Unauthorized.css';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
    <div className='unauthorized'>
        <h1>UNAUTHORIZED ACCESS:</h1>
        <Link to='/'>Go back to home page</Link>
    </div>
    )
}
