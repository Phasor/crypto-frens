import React from 'react'

export default function GoogleLogin() {

    const handleGoogleLogin = async () => {
        try {
            //const response = await fetch('http://localhost:3000/api/v1/auth/facebook', 
            window.open("http://localhost:3000/api/v1/auth/google", "_self");
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  )
}
