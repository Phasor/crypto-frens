import React from 'react'
import formatDate from '../utils/formatDate'

export default function User({user}) {
  return (
    <div className='flex-grow h-screen pt-6 pb-6'>
        <div className='mt-10 mx-auto max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-md shadow border p-4'>
            <div className='flex space-x-3 mb-2 items-center'>
                <img src={user.profileImage} alt='profile' className='h-20 w-20 object-cover rounded-full' />
                <p className='font-medium text-xl capitalize'>{user.firstName} {user.lastName}</p>
            </div>
            <p>Nick Name: {user.shortName}</p>
            <p>Email: {user.username}</p>
            <p>Joined: {formatDate(user.joinDate)}</p>
        </div>
    </div>
  )
}

