import React, { useEffect, useState } from 'react'

export default function CurrentFriendsList({friends, setFriends, pendingFriendsReceived}) {
    const [error, setError] = useState([]);

    useEffect(() => {
    const getFriends = async() => {
        const userID = localStorage.getItem('userID');
        try{
            const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getFriends`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }   
            });
            const data = await response.json();
            if (data.success){
                setFriends(data.friends);
            } else {
                setError(data.message);
            }
        } catch(err){
            setError(err.message);
        }
    }
    getFriends();
},[pendingFriendsReceived, setFriends])

const removeFriend = async (friendID) => {
    try{
        const userID = localStorage.getItem('userID');
        const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/deleteFriend`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({friendID: friendID})
            }
        )
        const data = await response.json();
        if (data.success){
            // remove friend from friends list
            const newFriends = friends.filter((friend) => friend._id !== friendID);
            setFriends(newFriends);
        }

    }catch(err){
        setError(err.message);
        console.log(err);
    }
}

  return (
    <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
        <h2 className='font-medium mb-2'>Current Friends</h2>
            {friends && friends.map((friend) => {
                return( 
                    <div className='flex justify-between'>
                        <div className='flex space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium'>
                            {friend.profileImage && <img src={friend.profileImage} referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>}
                            <p>{friend.firstName} {friend.lastName}</p>
                        </div>
                        <div>
                            <button onClick={() => removeFriend(friend._id)} className='p-2 rounded bg-blue-500 hover:bg-blue-600 text-white'>Remove</button>
                        </div>
                    </div>
            )})}
        {error && <p>{error}</p>}
    </div>
  )
}
