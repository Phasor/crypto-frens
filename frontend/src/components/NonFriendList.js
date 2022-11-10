import React, { useEffect, useState } from 'react'

export default function NonFriendList({users, setUsers, friends}) {
    
    const [error, setError] = useState([]);
    console.log('non friend list rendered')

    useEffect(() => {
    const getUsers = async () => {
        const response = await fetch(
            'http://localhost:3000/api/v1/user/all/excluding-friends',
            {method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
        const data = await response.json();
        if (data.success){
            setUsers(data.users);
            //console.log(data.users);
        } else {
            setError(data.message);
        }
    }
    getUsers();
},[setUsers, friends])

const addFriend = async (friend) => {
    const senderID = localStorage.getItem('userID');
    if(localStorage.getItem('userID'))
    {
        try{
            const response = await fetch(
                `http://localhost:3000/api/v1/user/${senderID}/friend-request`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({friendID: friend._id})
                });
            const data = await response.json();
            if (data.success === true){
                setUsers(users.filter(user => user._id !== friend._id));
            }
            console.log("Friend request sent");
        }   
        catch(err){
            console.log(err);
        }
    }
    else{
        console.log('You must be logged in to add friends');
    }
}

  return (
        <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
            <h2 className='font-medium mb-2'>Other Users - make new friends!</h2>
            {users.map(user => {
                return (
                    <div className='flex justify-between my-2'>
                        <div className='flex flex-1 space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium'>
                            <img src={user.profileImage} referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>
                            <p className='font-medium'>{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <button onClick={() => addFriend(user)} className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg'>Send Friend Request</button>
                        </div>
                    </div>
                )
            })}
            {error && <p className='text-red-500'>{error}</p>}
        </div>
  )
}
