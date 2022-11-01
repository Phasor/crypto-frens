import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Failed() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/');
    },1000)
    },[navigate])


  return (
    <div>Login Failed</div>
  )
}
