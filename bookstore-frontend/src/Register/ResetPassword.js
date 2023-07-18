import './Login.css';
import { useState } from 'react';
import Card from '../Card';
import Navigation from '../Navigation';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword()
{
    const token = useParams().token;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const API = 'http://localhost:8080/verify-reset';
    const [message, setMessage] = useState('Changing password...');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.password1.value !== e.target.password2.value) {
            alert('Passwords must match')
            return;
        }

        if(e.target.password1.value.length < 6) {
            alert("Password too short");
            return;
        }

        console.log(token);
        axios.post(API, null, {
            params: {
                token: token,
                password: e.target.password1.value
            }
        }).then((res) => {
            if(res.status === 200) {
                setMessage("Your password has been reset.");
            } else {
                alert("This shouldn't happen");
            }
        }).catch((err) => {
            console.log(err.response.data);
            setMessage("Something went wrong. Password wasn't changed.");
        })

        setIsOpen(true);
    }

    return (<>
    <Navigation/>
    <Card className='login-page'>
        {(isOpen) ?
            <div>
                <label>{message}</label>
                <div className='login-btn'>
                    <button onClick={()=>navigate('/login')}>OK</button>
                </div>
            </div>
            :
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <input type='password' required name='password1'/>
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type='password' required name='password2'/>
                </div>
                <div className='login-btn'>
                    <button type='submit'>Reset Password</button>
                </div>
            </form>
        }
    </Card>
    </>);
}
