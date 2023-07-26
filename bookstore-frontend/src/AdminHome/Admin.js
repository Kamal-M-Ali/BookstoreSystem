import './Admin.css';
import { Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import Card from '../Card';

export default function Admin() {

    return (<>
        <AdminMenu />
        <div className='admin-banner'>
            <h1>Admin Menu</h1>
        </div>
        <div className='admin-btns'>
            <Card className='admin-util'>
                <h1>Manage Books</h1>
                <Link to='/Admin/ManageBooks/Add' className='admin-btn'>Add Book</Link>
                <Link to='/Admin/ManageBooks/Remove' className='admin-btn'>Remove Book</Link>
                <Link to='/Admin/ManageBooks/Update' className='admin-btn'>Update Book</Link>
            </Card>

            <Card className='admin-util'>
                <h1>Manage Users</h1>
                <p>Not yet implemented.</p>
            </Card>

            <Card className='admin-util'>
                <h1>Manage Promotions</h1>
                <Link to='/Admin/ManagePromotions/Add' className='admin-btn'>Add Promotion</Link>
            </Card>
        </div>
    </>)
}


