import React, { useEffect, useState } from 'react'
import SidebarRow from './SidebarRow'
import { UserPlusIcon, HomeIcon, WrenchIcon } from '@heroicons/react/24/solid';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'; 

export default function Sidebar({setDataFromUrl}) {
    const [user, setUser] = useState({});

    useEffect(()=> {
        const fetchUser = async () => {
            await setDataFromUrl();
            const response = await fetch(`http://localhost:3000/api/v1/user/${localStorage.getItem('userID')}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (data.success){
            setUser(data.user);
        } 
        }
        fetchUser();
    },[setDataFromUrl])


  return (
    <div className='p-2 max-w-[600px] xl:min-w-[300px] bg-gray-100 border-r-2 border-gray-200 h-screen'>
        <div className='mt-6'>
            <div className='p-4 space-x-3 flex'>
                {user && <img className='h-8 w-8 rounded-full' src={user.profileImage} referrerPolicy="no-referrer" alt="" />}
                <p className='font-medium hidden sm:inline-flex'>{user.firstName} {user.lastName}</p>
            </div>
            <Link to="/home"><SidebarRow Icon={HomeIcon} title="Feed" /></Link>
            <Link to="/users"><SidebarRow Icon={UserPlusIcon} title="Manage Friends" /></Link>
            <Link to="/user/myposts"><SidebarRow Icon={NewspaperIcon} title="My Posts" /></Link>
            <Link to="/settings"><SidebarRow Icon={WrenchIcon} title="Settings" /></Link>
        </div>
    </div>
  )
}
