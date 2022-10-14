import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div>
        <div>
            <p>Crypto Frens</p>
            <div>
                <Link to="/signup"><button>Sign Up</button></Link>
                <Link><button>Log In</button></Link>
            </div>
        </div>
    </div>
  )
}
