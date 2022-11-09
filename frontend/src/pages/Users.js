import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import CurrentFriendsList from '../components/CurrentFriendsList';
import FriendRequestsList from '../components/FriendRequestsList';
import NonFriendList from '../components/NonFriendList';
import FriendsSentList from '../components/FriendsSentList';

export default function Users() {
    const [users, setUsers] = useState([]);
    console.log('parent render')

    return (
        <div>
            <NavBar/>
                <div className='flex'>
                    {/* Sidebar */}
                    <Sidebar/>
                    
                    {/* Center Panel */}
                    <div className='flex flex-col flex-grow p-3 items-center border-2'>                        
                        <CurrentFriendsList/>
                        <FriendRequestsList/>
                        <FriendsSentList users={users}/>
                        <NonFriendList users={users} setUsers={setUsers}/>
                    </div>
                </div>
        </div>
    )
}
