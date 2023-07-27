import './AddBook.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import Card from '../Card';

export default function AddPromotion() {
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);

    function addPromotion(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios.put("http://localhost:8080/api/admin/add-promotion/:" + email, {
                code: e.target.code.value,
                percentage: e.target.percentage.value,
                start: e.target.start.value,
                end: e.target.end.value
            }).then((res) => {
                if (res.status === 200) {
                    setConfirmOpen(true);
                }
            }).catch((err) => {
                console.log(err.response);
                alert("[Error]: Couldn't add promotion")
            })
        }
    }

    return (<>
        <AdminMenu />
        {(confirmOpen) ?
            <Card className='confirm-wnd'>
                <h1>Promotion Added</h1>
                <h2>The promotion was added to the system.</h2>
                <div className='confirm-btn'>
                    <button onClick={() => { setConfirmOpen(false); navigate('/Admin/ManagePromotions/Add') }}>OK</button>
                </div>
            </Card>
            :
            <Card className='book-add-form'>
                <form onSubmit={addPromotion}>
                    <h2>Enter Promotion Details</h2>
                    <input type='text' name='code' placeholder='Code' required/>
                    <input type='text' name='percentage' placeholder='Percentage Off [as integer (e.g. 50 would be 50% off)]' required/>
                    <input type='text' name='start' placeholder='Start date (must use format: yyyy-mm-date)' required/>
                    <input type='text' name='end' placeholder='End date (must use format: yyyy-mm-date)' required/>

                    <div className='confirm-btn'>
                        <button type='submit'>Add Promotion</button>
                    </div>
                </form>
            </Card>
        }
    </>);
}
