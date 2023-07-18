import './Login.css';
import { useState } from 'react';
import Card from '../Card';
import Navigation from '../Navigation';
import axios from 'axios';

export default function ForgotPassword() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const API = 'http://localhost:8080/api/reset';
    const [message, setMessage] = useState('Sending reset email...');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(API, null, {
            params: { email: email }
        }).then((res) => {
            if (res.status === 200) {
                setMessage("Reset email sent if account exists.");
            } else {
                alert("This shouldn't happen");
            }
        }).catch((err) => {
            setMessage("Something went wrong");
        })


        setIsOpen(true);
        console.log("sent");
    }

    return (<>
        <Navigation />
        <Card className='login-page'>
            {(isOpen) ?
                <div>
                    <label>{message}</label>
                    <div className='login-btn'>
                        <button onClick={() => setIsOpen(false)}>OK</button>
                    </div>
                </div>
                :
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input type='email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='login-btn'>
                        <button type='submit'>Reset Password</button>
                    </div>
                </form>
            }
        </Card>
    </>);
}
