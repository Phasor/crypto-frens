import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar';

export default function Login() {
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        // delete any local storage variables
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('username');
        localStorage.removeItem('shortName');
        
        try{
            const response = await fetch('http://localhost:3000/api/v1/auth/login',
                {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                })
            });
            const data = await response.json();
            console.log(data);
            if(data.success){
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userID', data.user._id);
                localStorage.setItem('shortName', data.user.shortName);
                setTimeout(()=> navigate('/home'),1000);
            }
        }catch(err){
            console.log(err);
        }
    }



  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <Link to="/home">Home</Link>
                <h1>Log In</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor="username">Email</label>
                    <input type="email" name="username" placeholder='ben@gmail.com' id="username"/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Password'/>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    </div>
  )
}
