import React, { useState, useEffect } from 'react'
import formatDate from '../utils/formatDate';

export default function User({ user }) {
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
            await fetch(
                `http://localhost:3000/api/v1/user/${senderID}/friend-request`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({friendID: friend._id})
                });
            // const data = await response.json();
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
    <div>
        <h3>{user.firstName} {user.lastName}</h3>
        <p>Joined: {formatDate(user.joinDate)}</p>
        <button onClick={() => addFriend(user)}>Add Friend</button>
    </div>
  )
}
