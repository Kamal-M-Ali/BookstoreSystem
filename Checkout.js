import './Checkout.css';
import Card from '../Card';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Checkout() {
    const API = 'http://localhost:8080/api/profile/:';
    const [step, setStep] = useState(0);
    const [editInfo, setEditInfo] = useState(false);
    const [editPaym, setEditPaym] = useState(false);
    const [editAddr, setEditAddr] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const promoAPI = 'http://localhost:8080/api/getPromo'; // Graham Addition

    function fetchData() {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');
        localStorage.setItem("promoApplied", 0); // Graham Addition

        if (email) {
            // get user account info
            axios.get(API + email)
                .then((res) => {
                    setAccountDetails(res.data);
                })
                .catch((err) => {
                    console.log(err.response);
                    setAccountDetails(null);
                })

            // get customer's cart
            axios.get("http://localhost:8080/api/cart/:" + email)
                .then((res) => {
                    setCartItems(res.data.cartBooks);
                })
                .catch((err) => {
                    console.log(err.response);
                    setCartItems([]);
                    navigate('/');
                    alert("[Error] Unable to retrieve cart");
                })
        } else {
            setCartItems([]);
            setAccountDetails(null);
        }
    }
    useEffect(fetchData, [navigate])

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

    function addPaymentCard(e) {
        e.preventDefault();
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (e.target.cardOwner.value === '' && e.target.cardNumber.value === ''
            && e.target.expDate.value === '' && e.target.cvv.value === '') {
            setEditPaym(false);
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

    function countTotalPrice() {
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
            price += cartItems[i].book.price * cartItems[i].quantity;
        }
        if(localStorage.getItem("promoApplied")) { // Graham Addition
            price = price * (localStorage.getItem("promoApplied") / 100);
        }
        return price;
    }

    function applyPromotion(e) { // Graham Addition this whole function
        e.preventDefault();
        let promoExists = false;
        let percentOff;
        axios.get(promoAPI, null, { //FIXME! Does not work for some reason
            params: {
                code: e.target.promoCode.value
            }
        }).then((res) => {
            promoExists = true;
            percentOff = res.data.percentage;
        }).catch((err) => {
            console.log(err.response);
            alert(typeof err.response.data === 'string' ? err.response.data : "[Error]: Promo code does not exist")
        })
        if (promoExists) {
            localStorage.setItem("promoApplied", percentOff);
        }
    } // end apply promotion

    function placeOrder() {
        // TODO



        // advance to confirmation screen
        setStep(2)
    }

    return (<>
        <Navigation />
        {(accountDetails !== null) ?
            <div className='checkout-page'> {
                // FIRST STEP OF CHECKOUT
                ((step) === 0 &&
                    <div className='checkout-pt0'>
                        <Card className='confirm-shipping'>
                            <h1>Shipping Information</h1>
                            <hr />
                            <div>
                                <h3>Personal Info</h3>
                                {(!editInfo) ?
                                    <div>
                                        <p>Name: {accountDetails.name}</p>
                                        <p>Phone Number: {accountDetails.phoneNumber}</p>
                                        <button className='confirm-checkout-btn' onClick={() => setEditInfo(true)}>Edit personal info</button>
                                    </div>
                                    :
                                    <form onSubmit={changeInfo}>
                                        <input type='text' name='fullName' placeholder='Full Name' />
                                        <input type='text' name='phoneNumber' placeholder='Phone Number' />

                                        <button className='confirm-checkout-btn' type='submit'>Finish</button>
                                    </form>
                                }

                                <div><h3>Address</h3>
                                    {(!editAddr) ?
                                        <div>
                                            <p>{accountDetails.address.street}</p>
                                            <p>{accountDetails.address.city}</p>
                                            <p>{accountDetails.address.state}, {accountDetails.address.zipcode}</p>
                                            <button className='confirm-checkout-btn' onClick={() => setEditAddr(true)}>Edit address</button>
                                        </div>
                                        :
                                        <form onSubmit={changeAddress}>
                                            <input type='text' name='street' placeholder='Street' />
                                            <input type='text' name='city' placeholder='City' />
                                            <input className='state' name='state' type='text' placeholder='State' />
                                            <input className='zip' name='zipcode' type='text' placeholder='Zip code' />

                                            <button className='confirm-checkout-btn' type='submit'>Finish</button>
                                        </form>
                                    }
                                </div>
                            </div>
                        </Card>

                        <Card className='confirm-shipping'>
                            <h1>Payment Method</h1>
                            <hr />
                            {(selectedCard === null) ?
                                ((!editPaym) ?
                                    (<>
                                        {accountDetails.paymentCards.map((paymentCard, k) =>
                                            <div key={k}>
                                                <h3>Card {k + 1}</h3>
                                                <p>{paymentCard.cardOwner}</p>
                                                <p>**** **** **** {paymentCard.lastFour}</p>
                                                <p>Exp: {paymentCard.expDate}</p>
                                                <div className='payment-opts'>
                                                    <button className='confirm-checkout-btn' onClick={() => setSelectedCard(paymentCard)}>Use this card</button>
                                                </div>
                                                {k !== accountDetails.paymentCards.length - 1 && <hr className='small-hr' />}
                                            </div>
                                        )}
                                        {accountDetails.paymentCards.length < 3 &&
                                            <button className='confirm-checkout-btn add-payment' onClick={() => setEditPaym(true)}>Add new card</button>}
                                    </>)
                                    :
                                    <form onSubmit={addPaymentCard}>
                                        <input type='text' name='cardOwner' placeholder='Name on Card' />
                                        <input type='text' name='cardNumber' placeholder='Card number' />
                                        <input className='card-date' name='expDate' type='text' placeholder='Expiration date' />
                                        <input className='card-cvv' name='cvv' type='text' placeholder='CVV' />

                                        <button className='confirm-checkout-btn' type='submit'>Finish</button>
                                    </form>)
                                :
                                <div>
                                    <p>{selectedCard.cardOwner}</p>
                                    <p>**** **** **** {selectedCard.lastFour}</p>
                                    <button className='confirm-checkout-btn' onClick={() => setSelectedCard(null)}>Change</button>
                                </div>
                            }
                            <hr className />
                            <button className='confirm-checkout-btn' onClick={
                                () => { selectedCard === null ? alert("Must select a payment method") : setStep(1) }}>
                                Next Step
                            </button>
                        </Card>
                    </div>)

                // SECOND STEP OF CHECKOUT
                || ((step) === 1 &&
                    <div className='checkout-pt1'>
                        <Card className='confirm-shipping'>
                            <h1>Shipping Information</h1>
                            <hr />
                            <div className='confirm-shipping-inner'>
                                <div className='order-billing-info'>
                                    <h3>Personal Info</h3>
                                    <p>Name: {accountDetails.name}</p>
                                    <p>Phone Number: {accountDetails.phoneNumber}</p>

                                    <h3>Shipping Address</h3>
                                    <p>{accountDetails.address.street}</p>
                                    <p>{accountDetails.address.city}, {accountDetails.address.state} {accountDetails.address.zipcode}</p>
                                </div>

                                <div className='order-payment-info'>
                                    <h3>Payment Card</h3>
                                    <p>{selectedCard.cardOwner}</p>
                                    <p>**** **** **** {selectedCard.lastFour}</p>
                                </div>
                            </div>

                        </Card>
                        <Card className='confirm-cart-total'>
                            <h1>Order Summary</h1>
                            <hr />
                            {cartItems.map((cartItem) =>
                                <p className='checkout-book-title'>{cartItem.quantity} {cartItem.book.title} - ${cartItem.book.price}</p>
                            )}
                            <form className='promo-code' onSubmit={applyPromotion}>
                                <input type='text' name='promoCode' placeholder='Apply promo code' />
                            </form>
                            <h2><b>Total:</b> ${countTotalPrice().toFixed(2)}</h2>
                            <button className='confirm-checkout-btn' onClick={placeOrder}>Place Order</button>
                        </Card>
                    </div>)


                // FINAL STEP OF CHECKOUT
                || ((step) === 2 &&
                    <Card className='checkout-pt2'>
                        <label>Your order is complete! A confirmation email has been sent your email addresss.</label>
                        <button className='confirm-checkout-btn' onClick={() => { setStep(0); navigate('/') }}>OK</button>
                    </Card>)
            } </div>
            :
            <div className='checkout-error-page'>
                <h1>Login to checkout</h1>
            </div>
        }
    </>);
}
