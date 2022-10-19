import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div>
        <div>
            <strong><p>Crypto Frens</p></strong>
            <div>
                <Link to="/signup"><button>Sign Up</button></Link>
                <Link><button>Log In</button></Link>
            </div>
            ____________________________________________________________________________________________________
        </div>
    </div>
  )
}
