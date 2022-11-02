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
    <div className='min-w-[150px]'>
        <img src="/googleSigninButton.png" alt="google sign in button" onClick={handleGoogleLogin} width={240} className="md:p-2 cursor-pointer hover:animate-pulse"/>
    </div>
  )
}
