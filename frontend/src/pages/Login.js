import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar';

export default function Login() {

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/api/v1/auth/login',
                {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: e.target.email.value,
                    password: e.target.password.value,
                })
            });
            const data = await response.json();
            console.log(data);
        }catch(err){
            console.log(err);
        }
    }



  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <Link to="/">Home</Link>
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
