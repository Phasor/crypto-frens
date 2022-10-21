import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
// import { Link } from 'react-router-dom';
import User from '../components/User';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingFriendsReceived, setPendingFriendsReceived] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingFriendsSent, setPendingFriendsSent] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch(
                'http://localhost:3000/api/v1/user/all',
                {method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
            const data = await response.json();
            if (data.success){
                setUsers(data.users);
                setLoading(false);
            } else {
                setErrors(data.message);
            }
        }
        getUsers();
    },[])

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
                setErrors(data.message);
            }
        }
        getPendingFriendsReceived();
    },[])

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
                    setErrors(data.message);
                }
            } catch(err){
                setErrors(err.message);
            }
        }
        getFriends();
    },[])

    useEffect(() => {
        const getPendingFriendsSent = async() => {
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
                } else {
                    setErrors(data.message);
                }
            } catch(err){
                setErrors(err.message);
            }
        }
        getPendingFriendsSent();
    },[])

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
            if (data.success){
                //refresh page
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
                        setErrors(data.message);
                    }
                } catch(err){
                    setErrors(err.message);
                }
            } else {
                setErrors(data.message);
            }
        }catch(err){
            setErrors(err.message);
            console.log(err);
        }
    }

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
                        setErrors(data.message);
                    }
                } catch(err){
                    setErrors(err.message);
                }
            }

        }catch(err){
            setErrors(err.message);
            console.log(err);
        }
    }



    return (
    <div>
        <div>
            <NavBar/>
                <div>
                    <div>
                        <h2>Friends</h2>
                        {friends.map((currentFriend) => {
                            return (
                                <div key={currentFriend._id}>
                                    <p>{currentFriend.firstName}</p>
                                    <p>{currentFriend.lastName}</p>
                                    <p>{currentFriend.username}</p>
                                    <button onClick={() => removeFriend(currentFriend._id)}>Remove</button>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h2>Pending Friend Requests Received</h2>
                        {pendingFriendsReceived.map((friend) => {
                            return (
                                <div key={friend._id}>
                                    <p>{friend.firstName}</p>
                                    <p>{friend.lastName}</p>
                                    <p>{friend.username}</p>
                                    <button onClick={() => acceptFriendRequest(friend._id)}>Accept</button>
                                </div>
                            )
                            })
                        }
                    </div>
                    <div>
                        <h2>Pending Friend Requests Sent</h2>
                        {pendingFriendsSent.map((friend) => {
                            return (
                                <div key={friend._id}>
                                    <p>{friend.firstName}</p>
                                    <p>{friend.lastName}</p>
                                    <p>{friend.username}</p>
                                </div>
                            )
                            })
                        }

                    </div>
                    <div>
                        <h2>All Users</h2>
                        {loading ? <p>Loading...</p> :
                            users.map((user) => (
                                <User 
                                    key={user._id}
                                    user={user}
                                />
                            ))
                        }
                    </div>
                    {errors && <p>{errors}</p>}
                </div>
        </div>
    </div>
    )
}
