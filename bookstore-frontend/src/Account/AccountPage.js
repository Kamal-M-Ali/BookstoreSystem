import './AccountPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import Card from '../Card'
import axios from 'axios';

export default function AccountPage() {
    // fetch user profile
    const API = 'http://localhost:8080/api/profile/:';
    const navigate = useNavigate();
    const [ accountDetails, setAccountDetails ] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');
        
        if (email) {
            axios.get(API + email)
            .then((res) => {
                // res.data=customer json data
                console.log(res.data);
                setAccountDetails(res.data);
            })
            .catch((err) => {
                console.log(err.response);
                setAccountDetails(null);
            })
        } else {
            setAccountDetails(null);
        }
    }, [navigate])

    const [editInfo, setEditInfo] = useState(false);
    const [editPaym, setEditPaym] = useState(false);
    const [editAddr, setEditAddr] = useState(false);
    const [editPswd, setEditPswd] = useState(false);

    function changePassword(e) {
        e.preventDefault();
        if (e.target.password1.value !== e.target.password2.value) {
            alert('Passwords must match')
            return;
        }

        const email = localStorage.getItem('email') || sessionStorage.getItem('email');
        
        if (email) {
            axios.post("http://localhost:8080/api/change-password/:" + email, null, { params : {
                password: e.target.password1.value
            }}).then((res)=>{
                if (res.status === 200) {
                    alert("Password changed");
                    setEditPswd(false);
                }
            }).catch((err)=>{
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't change password")
            })
        }
    }

    return (<>
        <Navigation />
        {(accountDetails !== null) ?
            (<Card className='account-form'>
                <h1>Personal Info</h1>
                {(!editInfo) ?
                    <div>
                        <p>Name: {accountDetails.name}</p>
                        <p>Phone Number: {accountDetails.phoneNumber}</p>
                        <button className='account-edit-btn' onClick={() => setEditInfo(true)}>Edit personal info</button>
                    </div>
                    :
                    <form onSubmit={() => setEditInfo(false)}>
                        <input type='text' placeholder='Full Name' />
                        <input type='text' placeholder='Phone Number' />

                        <button className='account-edit-btn' type='submit'>Save</button>
                    </form>
                }
                <hr />

                <h1>Address</h1>
                {(!editAddr) ?
                    <div>
                        <p>{accountDetails.address.street}</p>
                        <p>{accountDetails.address.city}</p>
                        <p>{accountDetails.address.state}, {accountDetails.address.zipcode}</p>
                        <button className='account-edit-btn' onClick={() => setEditAddr(true)}>Edit address</button>
                    </div>
                    :
                    <form onSubmit={() => setEditAddr(false)}>
                        <input type='text' placeholder='Street' />
                        <input type='text' placeholder='City' />
                        <input className='state' type='text' placeholder='State' />
                        <input className='zip' type='text' placeholder='Zip code' />

                        <button className='account-edit-btn' type='submit'>Save</button>
                    </form>
                }
                <hr />

                

                <h1>Password</h1>
                {(!editPswd) ?
                    <div>
                        <button className='account-edit-btn' onClick={() => setEditPswd(true)}>Change Password</button>
                    </div>
                    :
                    <form onSubmit={changePassword}>
                        <input type='password' name='password1' placeholder='New Password (6+ characters)' />
                        <input type='password' name='password2' placeholder='Confirm Password' />
                        <button className='account-edit-btn' type='submit'>Save</button>
                    </form>
                }
                <hr />

                <h1>Order History</h1>
                <Link to='/Account/OrderHistory' className='account-edit-btn account-link'>View</Link>
            </Card>)
            :
            (<div className='login-for-account'>
                <br />
                <h1>Login to view/edit account details.</h1>
            </div>)
        }

    </>);
}
