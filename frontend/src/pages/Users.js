import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import CurrentFriendsList from '../components/CurrentFriendsList';
import FriendRequestsList from '../components/FriendRequestsList';
import NonFriendList from '../components/NonFriendList';
import FriendsSentList from '../components/FriendsSentList';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingFriendsReceived, setPendingFriendsReceived] = useState([]);
    console.log('parent render')

    return (
        <div>
            <NavBar/>
                <div className='flex'>
                    {/* Sidebar */}
                    <Sidebar/>
                    
                    {/* Center Panel */}
                    <div className='flex flex-col flex-grow p-3 items-center border-2'>                        
                        <CurrentFriendsList friends={friends} setFriends={setFriends} pendingFriendsReceived={pendingFriendsReceived}/>
                        <FriendRequestsList pendingFriendsReceived={pendingFriendsReceived} setPendingFriendsReceived={setPendingFriendsReceived}/>
                        <FriendsSentList users={users}/>
                        <NonFriendList users={users} setUsers={setUsers} friends={friends}/>
                    </div>
                </div>
        </div>
    )
}
