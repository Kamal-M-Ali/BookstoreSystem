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
                    setOrders(res.data.sort((a, b) => a.orderId - b.orderId));
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
                        date={order.orderedDate.substring(0,10)}
                        status={order.orderStatus}
                        total={order.totalPrice.toFixed(2)}
                        books={order.orderedBooks}
                        paymentCard={order.paymentCard}
                        address={order.address}
                    />
                )
            }

        </div>
    </>);
}
