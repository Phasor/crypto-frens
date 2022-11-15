import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import GoogleLogin from '../components/GoogleLogin'

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

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
            } else {
                setError(data.message);
                console.log(data.message);
            }
        }catch(err){
            console.log(err);
            setError(err.message);
        }
    }



  return (
    <div>
        <div>
            <NavBar/>
            <div className='w-full h-screen flex justify-center'>
                <div className='flex-col mt-20 p-4'>
                    <h1 className='text-2xl'>Log In</h1>
                    <div className='flex border rounded-md mt-2 shadow-md p-2 bg-white'>
                        <form onSubmit={submitHandler} className=" border rounded-md p-2 md:p-4 md:m-5 my-10">
                            <div className='flex items-center outline-none justify-between'>
                                <label htmlFor="username">Email</label>
                                <input className="border rounded-md outline-none ml-2 p-1 text-gray-500" type="email" name="username" placeholder='ben@gmail.com' id="username"/>
                            </div>
                            <div className='flex items-center outline-none justify-between mt-2'>
                                <label htmlFor="password">Password</label>
                                <input className="border rounded-md outline-none ml-2 p-1" type="password" name="password" id="password" placeholder='Password'/>
                            </div>
                            <button type="submit" className='w-full mt-4 bg-gray-500 hover:bg-blue-500 rounded-lg p-1 text-white'>Log In</button>
                        </form>
                        <div className='flex mx-4 items-center justify-center  bg-gray-200 rounded-full w-[1px] my-3'>
                            <p className='md:text-2xl'>OR</p>
                        </div>
                        <div className='flex items-center md:p-4'>
                            <GoogleLogin/>
                        </div>
                    </div>
                    {error && <p className='text-red-500 p-1'>{error}</p>}
                </div>
                <br/>
            </div>
        </div>
    </div>
  )
}
