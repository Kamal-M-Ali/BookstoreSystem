import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Home from './UserHome/Home';
import ErrorPage from './ErrorPage';
import Login from './Register/Login';
import Signup from './Register/Signup';
import ForgotPassword from './Register/ForgotPassword';
import Admin from './AdminHome/Admin';
import AddBook from './AdminHome/AddBook';
import RemoveBook from './AdminHome/RemoveBook';
import Remove from './AdminHome/Remove';
import UpdateBook from './AdminHome/UpdateBook';
import Update from './AdminHome/Update';
import AccountPage from './Account/AccountPage';
import OrderHistory from './Account/OrderHistory';
import Shop from './Shop/Shop';
import View from './Shop/View';
import Cart from './Checkout/Cart';
import Checkout from './Checkout/Checkout'
import ResetPassword from './Register/ResetPassword';
import Unauthorized from './Unauthorized';

export default function App() {
  const key = 'jwtToken'

  const [adminStatus, setAdminStatus] = useState(false);
  const API = 'http://localhost:8080/api/admin-menu?email=';

  useEffect(()=>{
    const email = localStorage.getItem('email') || sessionStorage.getItem('email');

    if (email) {
      axios.get(API + email)
        .then((res) => {
          setAdminStatus(true);
        })
        .catch((err) => {
          console.log(err.response);
          setAdminStatus(false);
        })
    } else {
      setAdminStatus(false);
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (token) {
      axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
    }
  })

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/Shop' element={<Shop />} />
        <Route path='/View/:id' element={<View />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Checkout' element={<Checkout />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/Account' element={<AccountPage />} />
        <Route path='/Account/OrderHistory' element={<OrderHistory />} />
        <Route path='/Admin' element={adminStatus ? <Admin /> : <Unauthorized />} />
        <Route path='/Admin/ManageBooks/Add' element={adminStatus ? <AddBook /> : <Unauthorized />} />
        <Route path='/Admin/ManageBooks/Remove' element={adminStatus ? <RemoveBook /> : <Unauthorized />} />
        <Route path='Admin/ManageBooks/RemoveBook/:isbn' element={adminStatus ? <Remove /> : <Unauthorized />} />
        <Route path='Admin/ManageBooks/UpdateBook/:isbn' element={adminStatus ? <Update /> : <Unauthorized />} />
        <Route path='/Admin/ManageBooks/Update' element={adminStatus ? <UpdateBook /> : <Unauthorized />} />
        <Route path='/ResetPassword/:token' element={<ResetPassword />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}
