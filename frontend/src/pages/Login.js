import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import GoogleLogin from '../components/GoogleLogin'

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const title = "Crypto Frens - Log In";

    useEffect(() => {
      document.title = title;
    }, [title]);

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

    const testUserLogin = () => {
        localStorage.setItem('token','Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzYxYWM3MGYwOTU3ODMxYWJlZjk4MWEiLCJpYXQiOjE2Njg1MDU2OTU1NDAsImV4cCI6MTY2ODUwNTc4MTk0MH0.AKVvf_Hhja_xWcwPJMCxOyeAY-IrBbduOLxNG0O7e2VJnjvgSEOfGwcUDZvre0gvEVzWEj8TN0taMX4_LDNSerRAx7YLyuCut1VrIgmIofecG9WWgiV0FWBz21SlX5YQRUFVKBjmmvUCxa-33HdFlZCxUI5BFJeavmy-aLF_WwZ0AMZCWlPvvY8f2GGo0JY7Iw0sY5Cy7iktOsSzwaB67-SvosgjLfCtehelbLZvXf9837D-jsOONYx1YFNgV0lHAAZJLqwMJ2y1_sY9KmDzapOVaG9GJALv_-J6GrOSq1gRs_ZwX2L8UZbKe31KhsOanPJpOAjlwMq1_mqiWgC7j7wPbFlCqAW6NCIsySq3Avpfa4Dx7Jn7aeJwH2wTKS75gtnFyfFQS9-h9sgJfeuHcq2F9OfhABP77P09me276cnW1wW28MIkcNHIlzJhhd7iWXSZvQyK-J5oVVIKUTAVd2PNw5FkdUWE_A56_8mwLcq8mjKDcb4cjsozcswQxvze4HxQcqc18j7OVWgqfgSL5lg1_eY6l7Kli8VRIG4EKXzy8B0yF4qYgn31rDyrgKjn9RyLybg3H02oJvH_tBsmyqTDtldCV5NIQ-PAYPTQ63wzBCeUi3_PGQwT3Rjw2sPnqQfiqgMCgUNhMH-QsARpxS8VRutJs91fIKvkR8AyggQ');
        localStorage.setItem('username', 'a@test.com');
        localStorage.setItem('userID', '6361ac70f0957831abef981a');
        setTimeout(()=> navigate('/home'),1000);
    }


  return (
    <div>
        <div>
            <NavBar/>
            <div className='w-full h-screen flex justify-center'>
                <div className='flex-col mt-20 p-4'>
                    <div className='mb-10'>
                        <h2 className='text-2xl'>New?</h2>
                        <Link to="/signup"><button className='mt-2 py-1 px-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg border'>Sign Up</button></Link>
                    </div>
                    <h2 className='text-2xl'>Log In</h2>
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
                            <button type="submit" data-test="login-button-main" className='w-full mt-4 bg-blue-500 hover:bg-blue-600 rounded-lg px-2 py-1  text-white shadow-lg border'>Log In</button>
                        </form>
                        <div className='flex mx-4 items-center justify-center  bg-gray-200 rounded-full w-[1px] my-3'>
                            <p className='md:text-2xl'>OR</p>
                        </div>
                        <div className='flex items-center md:p-4'>
                            <GoogleLogin/>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <p className='text-md'>Just looking around? Log in as test user below.</p>
                        <button onClick={testUserLogin} className='bg-blue-500 hover:bg-blue-600 shadow-md border text-white px-2 py-1 rounded-lg mt-2'>Test User</button>
                    </div>
                    {error && <p className='text-red-500 p-1'>{error}</p>}
                </div>
                <br/>
            </div>
        </div>
    </div>
  )
}
