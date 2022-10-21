import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
// import { Link } from 'react-router-dom';
import User from '../components/User';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingFriends, setPendingFriends] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch(
                'http://localhost:3000/api/v1/user/all',
                {type: 'GET', 
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
        const getPendingFriends = async () => {
            const userID = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3000/api/v1/user/${userID}/getPendingFriends`,
                {type: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
            const data = await response.json();
            if (data.success){
                setPendingFriends(data.pendingFriends);
            } else {
                setErrors(data.message);
            }
        }
        getPendingFriends();
    },[])



    return (
    <div>
        <div>
            <NavBar/>
                <div>
                    <div>
                        <h2>Pending Friend Requests</h2>
                        {pendingFriends.map((friend) => {
                            return <User key={friend._id} user={friend} />
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
