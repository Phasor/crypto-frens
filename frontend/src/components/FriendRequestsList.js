import React, { useState, useEffect } from 'react'

export default function FriendRequestsList({pendingFriendsReceived, setPendingFriendsReceived}) {
    const [error, setError] = useState([]);

    useEffect(() => {
        const getPendingFriendsReceived = async () => {
            const userID = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getPendingFriendsReceived`,
                {method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
            const data = await response.json();
            if (data.success){
                setPendingFriendsReceived(data.pendingFriends);
            } else {
                setError(data.message);
            }
        }
        getPendingFriendsReceived();
    },[setPendingFriendsReceived])

    const acceptFriendRequest = async (friendID) => {
    try{
        const userID = localStorage.getItem('userID');
        const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/friend-request/accept`,
            {method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({friendID: friendID})
            });
        const data = await response.json();
        if(data.success){
            // remove friend from pending friends list
            setPendingFriendsReceived(pendingFriendsReceived.filter(friend => friend._id !== friendID));
        }
    }catch(err){
        setError(err.message);
        console.log(err);
    }
}

  return (
    <>                     
        <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
            <h2 className='font-medium mb-2'>Friend Requests Received</h2>
            {pendingFriendsReceived.map(friend => {
                return (
                    <div key={friend._id} className='flex justify-between'>
                        <div className='flex flex-1 space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium'>
                            <img src={friend.profileImage} referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>
                            <p className='font-medium'>{friend.firstName} {friend.lastName}</p>
                        </div>
                        <div>
                            <button onClick={() => acceptFriendRequest(friend._id)} className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'>Accept</button>
                        </div>
                    </div>
                )
            })}
        </div>
        {error && <p className='text-red-500'>{error}</p>}
    </>
  )
}
