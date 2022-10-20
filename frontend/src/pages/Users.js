import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import User from '../components/User';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
    <div>
        <div>
            <NavBar/>
                <div>
                    <h1>User List</h1>
                    <div>
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
