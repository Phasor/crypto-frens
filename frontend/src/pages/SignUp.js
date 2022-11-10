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
    <div className='w-full h-screen'>
        <NavBar/>
        <div className='w-full flex justify-center items-center'>
            <form className='flex flex-col w-[90%] md:w-[50%] lg:w-[30%] xl:w-[25%] mt-6 lg:mt-20 rounded-lg bg-white shadow-lg' onSubmit={submitHandler}>
                <h1 className='font-medium text-xl px-4 py-2' >Sign Up</h1>
                <div className='px-8 py-2 flex flex-col'>
                    <label htmlFor="firstName">First Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-500 border' type="text" name="firstName" id="firstName" placeholder='Benjamin'/>
                    <label htmlFor="lastName">Last Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-500 border' type="text" name="lastName" id="lastName" placeholder='Smith'/>
                    <label htmlFor="shortName">Short Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-500 border' type="text" name="shortName" id="shortName" placeholder='Ben'/>
                    <label htmlFor="username">Email</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-500 border' type="email" name="username" id="username" placeholder='ben@test.com'/>
                    <label htmlFor="password">Password</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-500 border' type="password" name="password" id="password" placeholder='password'/>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg shadow px-2 py-1 mb-2 text-lg mt-2' type="submit">Sign Up</button>
                </div>
            </form>
            {errors ? <p>{errors}</p> : null}
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