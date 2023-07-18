import './Checkout.css';
import Card from '../Card';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout() {
    const [step, setStep] = useState(0);
    const [editInfo, setEditInfo] = useState(false);
    const [editPaym, setEditPaym] = useState(false);
    const [editAddr, setEditAddr] = useState(false);
    const navigate = useNavigate();
    const dummy_data = [
        {
            title: "The Great Gatsby",
            desc: "This is a book description temporary placeholder.",
            genre: "Young Adult",
            author: "F-Scott Fitzgerald",
            cover: "https://s26162.pcdn.co/wp-content/uploads/2018/02/gatsby-original2.jpg",
            rating: 4.3,
            price: 7.99,
            isbn: "000-000"
        },
        {
            title: "Divine Rivals",
            desc: "This is a book description temporary placeholder.",
            author: "Rebecca Ross",
            cover: "https://storage.googleapis.com/du-prd/books/images/9781250857439.jpg",
            rating: 4.7,
            price: 17.99,
            isbn: "000-007"
        },
        {
            title: "Warrior Girl Unearthed",
            desc: "This is a book description temporary placeholder.",
            author: "Angeline Boulley",
            genre: "Young Adult",
            cover: "https://storage.googleapis.com/du-prd/books/images/9781250766588.jpg",
            rating: 4.6,
            price: 14.99,
            isbn: "000-010"
        }
    ]

    const dummy_info = {
        personal: {
            name: "First Last",
            number: "000-000-0000"
        },

        payment: {
            name: "First Last",
            card: "0000 0000 0000 0000",
            exp: "00/00",
        },

        address: {
            street1: "Street 1",
            street2: "Street 2",
            state: "State",
            zip: "Zip code"
        },
    }

    function countTotalPrice() {
        let price = 0;
        for (let i = 0; i < dummy_data.length; i++) {
            price += dummy_data[i].price;
        }
        return Math.round(price * 100) / 100;
    }

    return (<>
        <Navigation />
        <div className='checkout-page'> {
            // FIRST STEP OF CHECKOUT
            ((step) === 0 &&
                <div className='checkout-pt0'>
                    <Card className='confirm-shipping'>
                        <h1>Shipping Information</h1>   
                        <hr />
                        <div>
                            <div><h3>Personal Info</h3>
                            {(!editInfo) ?
                                <div>
                                    <p>Name: {dummy_info.personal.name}</p>
                                    <p>Phone Number: {dummy_info.personal.number}</p>
                                    <button className='confirm-checkout-btn edit-btn' onClick={() => setEditInfo(true)}>Edit personal info</button>
                                </div>
                                :
                                <form onSubmit={() => setEditInfo(false)}>
                                    <input type='text' placeholder='Full Name' />
                                    <input type='text' placeholder='Phone Number' />

                                    <button className='confirm-checkout-btn edit-btn' type='submit'>Save</button>
                                </form>
                            } </div>
                            
                            <div><h3>Address</h3>
                            {(!editAddr) ?
                                <div>
                                    <p>{dummy_info.address.street1}</p>
                                    <p>{dummy_info.address.street2}</p>
                                    <p>{dummy_info.address.state}, {dummy_info.address.zip}</p>
                                    <button className='confirm-checkout-btn edit-btn' onClick={() => setEditAddr(true)}>Edit address</button>
                                </div>
                                :
                                <form onSubmit={() => setEditAddr(false)}>
                                    <input type='text' placeholder='Street Line 1' />
                                    <input type='text' placeholder='Street Line 2' />
                                    <input className='state' type='text' placeholder='State' />
                                    <input className='zip' type='text' placeholder='Zip code' />

                                    <button className='confirm-checkout-btn edit-btn' type='submit'>Save</button>
                                </form>
                            }</div>
                        </div>
                    </Card>

                    <Card className='confirm-shipping'>
                        <h1>Payment Method</h1>   
                        <hr />
                        <h3>Card</h3>
                        {(!editPaym) ?
                            <div>
                                <p>{dummy_info.payment.name}</p>
                                <p>{dummy_info.payment.card}</p>
                                <p>Exp: {dummy_info.payment.exp}</p>
                                <button className='confirm-checkout-btn edit-btn' onClick={() => setEditPaym(true)}>Edit payment method</button>
                            </div>
                            :
                            <form onSubmit={() => setEditPaym(false)}>
                                <input type='text' placeholder='Name on Card' />
                                <input type='text' placeholder='Card number' />
                                <input className='card-date' type='text' placeholder='Expiration date' />
                                <input className='card-cvv' type='text' placeholder='CVV' />

                                <button className='confirm-checkout-btn edit-btn' type='submit'>Save</button>
                            </form>
                        }
                        <hr className/>
                        <button className='confirm-checkout-btn' onClick={() => setStep(1)}>Next Step</button>
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
                                <p>Name: {dummy_info.personal.name}</p>
                                <p>Phone Number: {dummy_info.personal.number}</p>

                                <h3>Address</h3>
                                <p>{dummy_info.address.street1}</p>
                                <p>{dummy_info.address.street2}</p>
                                <p>{dummy_info.address.state}, {dummy_info.address.zip}</p>
                            </div>

                            <div className='order-payment-info'>
                                <h3>Payment Card</h3>
                                <p>{dummy_info.payment.name}</p>
                                <p>{dummy_info.payment.card}</p>
                                <p>Exp: {dummy_info.payment.exp}</p>
                            </div>
                        </div>

                    </Card>
                    <Card className='confirm-cart-total'>
                        <h1>Order Summary</h1>
                        <hr />
                        {dummy_data.map((book, k) =>
                            <p className='checkout-book-title'>{book.title}</p>
                        )}
                        <h2 className='confirm-cart-h2'><b>Total:</b> ${countTotalPrice()}</h2>
                        <button className='confirm-checkout-btn' onClick={() => setStep(2)}>Place Order</button>
                    </Card>
                </div>)


            // FINAL STEP OF CHECKOUT
            || ((step) === 2 &&
                <Card className='checkout-pt2'>
                    <label>Your order is complete! A confirmation email has been sent your email addresss.</label>
                    <button className='confirm-checkout-btn' onClick={() => { setStep(0); navigate('/') }}>OK</button>
                </Card>)
        } </div>
    </>);
}
