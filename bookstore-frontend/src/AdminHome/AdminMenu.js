import { Link, useNavigate } from 'react-router-dom';

export default function AdminMenu()
{
    const key = 'jwtToken';
    const navigate = useNavigate();

    return (
    <div className='nav-bar'>
        <p className='home-button'>
            <Link className='nav-link' to='/Admin'>Home</Link>
        </p>
        <p>
            <button className='nav-button' onClick={() => {sessionStorage.removeItem(key); localStorage.removeItem(key); navigate('/')}}>Logout</button>
        </p>
    </div>);
}
