import React, { useState, useEffect } from 'react'
import formatDate from '../utils/formatDate';
import { ToastContainer, toast } from 'react-toastify';

export default function User({ user, setPendingFriendsSent }) {
    const [senderID, setSenderID] = useState("");

    useEffect(() => {
        // set the sender of the friend requests
        const setUserID = () => {   
            setSenderID(localStorage.getItem('userID'));
        }
        setUserID();
    },[])


const addFriend = async (friend) => {
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
                toast.success('Friend request sent successfully');

                // update the user's pending friend request sent list
                const userID = localStorage.getItem('userID');
                try{
                    const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getPendingFriendsSent`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${localStorage.getItem('token')}`
                        }
                    });
                    const data = await response.json();
                    if (data.success){
                        setPendingFriendsSent(data.pendingFriends);
                    }    
                } catch(err){
                    console.log(err);
                }        
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
    <>
        <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        <div className='flex justify-between items-center'>
            <div className='flex space-x-4 items-center rounded hover:bg-gray-100'>
                <img src={user.profileImage} referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>
                <p className='font-medium'>{user.firstName} {user.lastName}</p>
            </div>
            <div className='flex justify-end'>
                <button className='rounded bg-blue-500 p-2 text-white hover:bg-blue-600 shadow' onClick={() => addFriend(user)}>Add Friend</button>
            </div>
        </div>
    </>
  )
}
