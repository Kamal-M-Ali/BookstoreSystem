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
    const [accountDetails, setAccountDetails] = useState(null);

    function fetchData() {
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
    }
    useEffect(fetchData, [navigate])

    const [editInfo, setEditInfo] = useState(false);
    const [editPaym, setEditPaym] = useState(false);
    const [editAddr, setEditAddr] = useState(false);
    const [editPswd, setEditPswd] = useState(false);

    function changeInfo(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (e.target.fullName.value === '' && e.target.phoneNumber.value === '') {
            setEditInfo(false);
            return;
        }

        if (email) {
            axios.post("http://localhost:8080/api/change-personal-info/:" + email, null, {
                params: {
                    name: (e.target.fullName.value !== '' ? e.target.fullName.value : accountDetails.name),
                    phoneNumber: (e.target.phoneNumber.value !== '' ? e.target.phoneNumber.value : accountDetails.phoneNumber)
                }
            }).then((res) => {
                if (res.status === 200) {
                    alert("Personal info changed");
                    fetchData();
                    setEditInfo(false);
                }
            }).catch((err) => {
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't change info")
                setEditInfo(false);
            })
        }
    }

    function changeAddress(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (e.target.street.value === '' && e.target.city.value === ''
            && e.target.state.value === '' && e.target.zipcode.value === '') {
            setEditAddr(false);
            return;
        }

        if (e.target.street.value === '' || e.target.city.value === ''
            || e.target.state.value === '' || e.target.zipcode.value === '') {
            alert('Please fill out all fields');
            return;
        }

        if (email) {
            axios.post("http://localhost:8080/api/change-address/:" + email, {
                street: e.target.street.value,
                city: e.target.city.value,
                state: e.target.state.value,
                zipcode: e.target.zipcode.value
            }).then((res) => {
                if (res.status === 200) {
                    alert("Address updated");
                    fetchData();
                    setEditAddr(false);
                }
            }).catch((err) => {
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't change address")
                setEditAddr(false);
            })
        }
    }

    function deletePaymentCard(paymentCard) {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios.post("http://localhost:8080/api/del-payment/:" + email, paymentCard)
            .then((res) => {
                if (res.status === 200) {
                    alert("Payment card deleted");
                    fetchData();
                    setEditInfo(false);
                }
            }).catch((err) => {
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't delete card")
                setEditInfo(false);
            })
        }
    }

    function addPaymentCard(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (e.target.cardOwner.value === '' && e.target.cardNumber.value === '' 
        && e.target.expDate.value === '' && e.target.cvv === '') {
            setEditAddr(false);
            return;
        }

        if (e.target.cardOwner.value === '' && e.target.cardNumber.value === '' 
        && e.target.expDate.value === '' && e.target.cvv === '') {
            alert('Please fill out all fields');
            return;
        }

        if (email) {
            axios.put("http://localhost:8080/api/add-payment/:" + email, {
                cardOwner: e.target.cardOwner.value,
                cardNumber: e.target.cardNumber.value,
                expDate: e.target.expDate.value
            }).then((res) => {
                if (res.status === 200) {
                    alert("Payment card added");
                    fetchData();
                    setEditPaym(false);
                }
            }).catch((err) => {
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't add payment card")
                setEditPaym(false);
            })
        }
    }

    function changePassword(e) {
        e.preventDefault();
        if (e.target.password1.value !== e.target.password2.value) {
            alert('Passwords must match')
            return;
        }

        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios.post("http://localhost:8080/api/change-password/:" + email, null, {
                params: {
                    password: e.target.password1.value
                }
            }).then((res) => {
                if (res.status === 200) {
                    alert("Password changed");
                    setEditPswd(false);
                }
            }).catch((err) => {
                console.log(err.response);
                alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Couldn't change password")
                setEditPswd(false);
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
                    <form onSubmit={changeInfo}>
                        <input type='text' name='fullName' placeholder='Full Name' />
                        <input type='text' name='phoneNumber' placeholder='Phone Number' />

                        <button className='account-edit-btn' type='submit'>Finish</button>
                    </form>
                }
                <hr className='account-form-hr' />

                <h1>Address</h1>
                {(!editAddr) ?
                    <div>
                        <p>{accountDetails.address.street}</p>
                        <p>{accountDetails.address.city}</p>
                        <p>{accountDetails.address.state}, {accountDetails.address.zipcode}</p>
                        <button className='account-edit-btn' onClick={() => setEditAddr(true)}>Edit address</button>
                    </div>
                    :
                    <form onSubmit={changeAddress}>
                        <input type='text' name='street' placeholder='Street' />
                        <input type='text' name='city' placeholder='City' />
                        <input className='state' name='state' type='text' placeholder='State' />
                        <input className='zip' name='zipcode' type='text' placeholder='Zip code' />

                        <button className='account-edit-btn' type='submit'>Finish</button>
                    </form>
                }
                <hr className='account-form-hr' />

                <h1>Payment Cards</h1>
                {(!editPaym) ?
                    (<>
                        {accountDetails.paymentCards.map((paymentCard, k) =>
                            <div key={k}>
                                <h2>Card {k+1}</h2>
                                <p>{paymentCard.cardOwner}</p>
                                <p>**** **** **** {paymentCard.lastFour}</p>
                                <p>Exp: {paymentCard.expDate}</p>
                                <div className='payment-opts'>
                                    <button className='account-edit-btn add-payment' onClick={()=>deletePaymentCard(paymentCard)}>Delete Card</button>
                                </div>
                                {k !== accountDetails.paymentCards.length-1 && <hr className='small-hr'/>}
                            </div>
                        )}
                        {accountDetails.paymentCards.length < 3 && 
                        <button className='account-edit-btn add-payment' onClick={() => setEditPaym(true)}>Add payment card</button>}
                    </>)
                    :
                    <form onSubmit={addPaymentCard}>
                        <input type='text' name='cardOwner' placeholder='Name on Card' />
                        <input type='text' name='cardNumber' placeholder='Card number' />
                        <input className='card-date' name='expDate' type='text' placeholder='Expiration date' />
                        <input className='card-cvv' name='cvv' type='text' placeholder='CVV' />

                        <button className='account-edit-btn' type='submit'>Finish</button>
                    </form>
                }
                <hr className='account-form-hr' />

                <h1>Password</h1>
                {(!editPswd) ?
                    <div>
                        <button className='account-edit-btn' onClick={() => setEditPswd(true)}>Change Password</button>
                    </div>
                    :
                    <form onSubmit={changePassword}>
                        <input type='password' name='password1' placeholder='New Password (6+ characters)' required />
                        <input type='password' name='password2' placeholder='Confirm Password' required />
                        <button className='account-edit-btn' type='submit'>Change</button>
                    </form>
                }
                <hr className='account-form-hr' />

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
