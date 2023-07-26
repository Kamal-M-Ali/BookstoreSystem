import './OrderHistory.css';
import { useState, useEffect } from 'react';
import Order from './Order';
import axios from 'axios';
import Navigation from '../Navigation';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    function fetch() {
        const email = localStorage.getItem('email') || sessionStorage.getItem('email');

        if (email) {
            axios
                .get('http://localhost:8080/api/orders/:' + email)
                .then((res) => {
                    setOrders(res.data);
                })
                .catch((err) => {
                    console.log('Error getting orders');
                });
        }
    }
    useEffect(fetch, []);

    return (<>
        <Navigation />
        <div className='order-hist-display'>
            {orders.length === 0 ?
                <h2 className='order-empty'>No orders to display.</h2>
                :
                orders.map((order, k) =>
                    <Order key={k}
                        id={order.orderId}
                        date={order.orderedDate}
                        status={order.orderStatus}
                        total={order.totalPrice}
                        books={order.orderedBooks}
                        paymentCard={order.paymentCard}
                        address={order.address}
                    />
                )
            }

        </div>
    </>);
}
