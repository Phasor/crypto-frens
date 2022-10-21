import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('shortName');
        localStorage.removeItem('username');
        setTimeout(()=> navigate('/login'),1000);
    }

  return (
    <div>
        <div>
            <strong><Link to="/home"><p>Crypto Frens</p></Link></strong>
            <div>
                <Link to="/home"><button>Home</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
                <Link to="login"><button>Log In</button></Link>
                <button onClick={logout}>Sign Out</button>
                <Link to="/users"><button>User List</button></Link>
                <Link to="/post/create"><button>Create Post</button></Link>
            </div>
            {localStorage.getItem('username') ? <p>Welcome, {localStorage.getItem('username')}</p> : null}
            ____________________________________________________________________________________________________
        </div>
    </div>
  )
}
