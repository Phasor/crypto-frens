import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FriendsList from '../components/FriendsList';
import User from '../components/User';

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await fetch(`http://localhost:3000/api/v1/user/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                console.log(`user: ${JSON.stringify(data.user)}`);
                setUser(data.user);
                setLoading(false);
            }catch(err){
                console.log(err);
            }
        }
        fetchUser();
    }, [id]);

  return (
    <div>
        <div>
            <NavBar/>
            <div className='w-full h-screen flex justify-center'>
                <Sidebar/>
                {!loading && <User user={user}/>}
                <FriendsList />
            </div>
        </div>
    </div>
  )
}
