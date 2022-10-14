import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function SignUp() {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const title = "Crypto Frens - Sign Up";

    useEffect(() => {
      document.title = title;
    }, [title]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/api/v1/user/signup', 
                {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName: e.target.firstName.value,
                    lastName: e.target.lastName.value,
                    shortName: e.target.shortName.value,
                    username: e.target.username.value,
                    password: e.target.password.value,
                })
            });
            const data = await response.json();
            if(data.success === true){
                setTimeout( () => navigate('/'), 2000 );
            }
            else{
                setErrors(data.errors);
            }
        } catch(err){
            console.log(err);
            setErrors(err);
        }
    }


  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <h1>Sign Up</h1>
                <Link to="/"> Home </Link>
                <form onSubmit={submitHandler}>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" name="firstName" id="firstName" placeholder='Benjamin'/>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" name="lastName" id="lastName" placeholder='Smith'/>
                    <label htmlFor="shortName">Short Name</label>
                    <input type="text" name="shortName" id="shortName" placeholder='Ben'/>
                    <label htmlFor="username">Email</label>
                    <input type="email" name="username" id="username" placeholder='ben@test.com'/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='password'/>
                    <button type="submit">Sign Up</button>
                </form>
                {errors ? <p>{errors}</p> : null}
            </div>
        </div>
    </div>
  )
}

// firstName: { type: String, required: true },
// lastName: { type: String, required: true },
// shortName: { type: String, required: true },
// username: { type: String, required: true },
// password: { type: String, required: true },
// joinDate: { type: Date, default: Date.now },
// birthDay: { type: Date, required: false },
// profileImage: { type: String, data: Buffer, required: false },
// pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
// friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],