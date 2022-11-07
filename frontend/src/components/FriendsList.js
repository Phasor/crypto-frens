import React, { useEffect, useState } from 'react'

export default function FriendsList() {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            const userID = localStorage.getItem("userID");
            const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getFriends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            console.log(data);
            setFriends(data.friends);
        }
        getFriends();
    }, []);

  return (
    <div>
        <div className='hidden lg:flex flex-col w-60 p-2 mt-5'>
            {friends && friends.map((friend) => (
                <div key={friend._id} className="flex space-x-2 p-1 border-b md:min-w-[200px] ">
                    {/* <div>
                        <img src={friend.profileImage} alt="" className="p-2 rounded-full overflow-hidden h-10 w-10"/>
                    </div> */}
                    <p className=" text-gray-500 p-2 font-medium">{friend.firstName} {friend.lastName}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
