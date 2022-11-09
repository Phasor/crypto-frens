import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
// import { Link } from 'react-router-dom';
import User from '../components/User';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import CurrentFriendsList from '../components/CurrentFriendsList';
import FriendRequestsList from '../components/FriendRequestsList';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingFriendsReceived, setPendingFriendsReceived] = useState([]);
    const [pendingFriendsSent, setPendingFriendsSent] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            } else {
                setErrors(data.message);
            }
        }
        getUsers();
    },[])

    // useEffect(() => {
    //     const getPendingFriendsReceived = async () => {
    //         const userID = localStorage.getItem('userID');
    //         const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getPendingFriendsReceived`,
    //             {method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${localStorage.getItem('token')}`
    //                 }
    //             });
    //         const data = await response.json();
    //         if (data.success){
    //             setPendingFriendsReceived(data.pendingFriends);
    //         } else {
    //             setErrors(data.message);
    //         }
    //     }
    //     getPendingFriendsReceived();
    // },[])

    // useEffect(() => {
    //     const getFriends = async() => {
    //         const userID = localStorage.getItem('userID');
    //         try{
    //             const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getFriends`,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${localStorage.getItem('token')}`
    //                 }   
    //             });
    //             const data = await response.json();
    //             if (data.success){
    //                 setFriends(data.friends);
    //             } else {
    //                 setErrors(data.message);
    //             }
    //         } catch(err){
    //             setErrors(err.message);
    //         }
    //     }
    //     getFriends();
    // },[])

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

    // const acceptFriendRequest = async (friendID) => {
    //     try{
    //         const userID = localStorage.getItem('userID');
    //         const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/friend-request/accept`,
    //             {method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${localStorage.getItem('token')}`
    //                 },
    //                 body: JSON.stringify({friendID: friendID})
    //             });
    //         const data = await response.json();
    //         if (data.success){
    //             //refresh friend list
    //             try{
    //                 const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getFriends`,
    //                 {
    //                     method: 'GET',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `${localStorage.getItem('token')}`
    //                     }   
    //                 });
    //                 const data = await response.json();
    //                 if (data.success){
    //                     setFriends(data.friends);
    //                     toast.success('Friend added successfully');
    //                 } else {
    //                     setErrors(data.message);
    //                 }
    //             } catch(err){
    //                 setErrors(err.message);
    //             }
    //             // refresh pending friends received
    //             const newPendingFriendsReceived = pendingFriendsReceived.filter((friend) => friend._id !== friendID);
    //             setPendingFriendsReceived([...newPendingFriendsReceived]);
    //         } else {
    //             setErrors(data.message);
    //         }
    //     }catch(err){
    //         setErrors(err.message);
    //         console.log(err);
    //     }
    // }

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
                //refresh friend list
                const newFriends = friends.filter((friend) => friend._id !== friendID);
                setFriends([...newFriends]);

                // remove user from all other users list
                const newUsers = users.filter(user => user._id !== friendID);
                setUsers([...newUsers]);
            }

        }catch(err){
            setErrors(err.message);
            console.log(err);
        }
    }



    return (
    <div>
            <NavBar/>
                <div className='flex'>
                    {/* Sidebar */}
                    <Sidebar/>
                  
                    {/* Center Panel */}
                    <div className='flex flex-col flex-grow p-3 items-center border-2'>

                        {/* Current Friends */}
                        {/* <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
                            <h2 className='font-medium mb-2'>Current Friends</h2>
                            {friends.map(friend => {
                                return (
                                    <div className='flex space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium'>
                                        <img src={friend.profileImage} referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>
                                        <p>{friend.firstName} {friend.lastName}</p>
                                    </div>
                                ) 
                            })}
                        </div> */}
                        
                        <CurrentFriendsList/>
                        <FriendRequestsList/>
                      




                        {/* Friend Requests Sent */}
                        <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
                            <h2 className='font-medium mb-2'>Friend Requests Sent</h2>
                            {pendingFriendsSent.map(friend => {
                                return (
                                    <div className='flex space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium'>
                                        <img src={friend.profileImage}  referrerPolicy="no-referrer" alt=""  className='h-10 w-10 rounded-full'/>
                                        <p>{friend.firstName} {friend.lastName}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* All None Friend Users */}
                        <div className='p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]'>
                            <h2 className='font-medium mb-2'>Other Users - make new friends!</h2>
                            {users.map((user) => (
                                    <User 
                                        key={user._id}
                                        user={user}
                                        setPendingFriendsSent={setPendingFriendsSent}
                                    />
                                ))
                            }
                        </div>



                    </div>
                    {/* <div> 
                        <div>
                            <h2>Friends</h2>
                            {friends.map((currentFriend) => {
                                return (
                                    <div key={currentFriend._id}>
                                        <p>Name: {`${currentFriend.firstName} ${currentFriend.lastName}`}</p>
                                        <p>Username: {currentFriend.username}</p>
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
                                        <p>Name: {`${friend.firstName} ${friend.lastName}`}</p>
                                        <p>Username: {friend.username}</p>
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
                                        <p>Name: {`${friend.firstName} ${friend.lastName}`}</p>
                                        <p>Username:{friend.username}</p>
                                    </div>
                                )
                                })
                            }
                        </div>
                        <div>
                            <h2>All Other Users</h2>
                            {users.map((user) => (
                                    <User 
                                        key={user._id}
                                        user={user}
                                        setPendingFriendsSent={setPendingFriendsSent}
                                    />
                                ))
                            }
                        </div>
                        {errors && <p>{errors}</p>}
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
                    </div> */}
                </div>
    </div>
    )
}
