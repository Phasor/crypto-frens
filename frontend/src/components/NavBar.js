import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HomeIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/react/24/solid';
import HeaderIcon from './HeaderIcon';

export default function NavBar() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLoggedIn(true);
        }
    }, [loggedIn])

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('shortName');
        localStorage.removeItem('username');
        setTimeout(()=> navigate('/login'),1000);
    }

  return (
    <div className='sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md'>

        {/* left */}
        <div className='flex items-center'>
            <div className='rounded-full overflow-hidden flex-shrink-0'>
                <img src="/cryptoFrensLogo.png" alt="logo" width={40} height={40}/>
            </div>
            <div className='hidden md:flex md:ml-2 md:items-center md:rounded-full bg-gray-100 p-2'>
                <MagnifyingGlassIcon className="h-6 text-gray-600"/>
                <input type="text" placeholder="Search CryptoFrens" 
                className="flex-shrink ml-2 items-center bg-transparent outline-none placeholder-gray-500"/>
            </div>
        </div>

        {/* Centre */}
        <div className='flex justify-center flex-grow'>
            {loggedIn && (
                <div className='flex space-x-6 md:space-x-2'>
                    <Link to='/home'><HeaderIcon active={true} Icon={HomeIcon}/></Link>
                    <HeaderIcon Icon={UsersIcon}/>
                    <HeaderIcon Icon={Cog8ToothIcon}/>
                </div>
            )}
        </div>

        {/* right */}
        <div className='flex items-center sm:space-x-2 whitespace-nowrap'>
            {loggedIn ? (
                <button onClick={logout}  className="w-[80px] bg-gray-400 rounded-lg text-white p-2 ml-4 hover:bg-blue-500">Log Out</button>
            ) : (
                <>
                    <Link to="/login"><button className="w-[80px] bg-gray-400 rounded-lg text-white p-2 hover:bg-blue-500">Log In</button></Link>
                    <Link to="/signup"><button className="w-[80px] bg-gray-400 rounded-lg text-white p-2 ml-4 hover:bg-blue-500">Sign Up</button></Link>
                </>
            )}
        </div>

        {/* <div>
            <strong><Link to="/home"><p>Crypto Frens</p></Link></strong>
            <div>
                <Link to="/home"><button>Home</button></Link>
                <Link to="login"><button>Log In</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
                <button onClick={logout}>Sign Out</button>
                <Link to="/users"><button>User List</button></Link>
                <Link to="/post/create"><button>Create Post</button></Link>
                <Link to="/user/myposts"><button>My Posts</button></Link>
            </div>
            {localStorage.getItem('username') ? <p>Welcome, {localStorage.getItem('username')}</p> : null}
            ____________________________________________________________________________________________________
        </div> */}


    </div>
  )
}
