import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FriendsList from '../components/FriendsList';
import User from '../components/User';
import { useLocation } from 'react-router-dom';

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

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

    const setDataFromUrl = async () => {
        if(location.search){ // there is a query string, hence this is a Google auth login, not a local auth login
            const rawData = location.search.split("=")[1];
            const firstElem = rawData.split("&")[0];
            const tokenValue =  firstElem.replace("%20", " ");
            // console.log(`tokenValue: ${tokenValue}`);
            // setTokenGoog(tokenValue);
            localStorage.setItem("token", tokenValue);
            const userIDValue = location.search.split("=")[3];
            localStorage.setItem("userID", userIDValue);
        }
    }

  return (
    <div>
        <div>
            <NavBar/>
            <div className='w-full h-screen flex justify-center'>
                <Sidebar setDataFromUrl={setDataFromUrl}/>
                {!loading && <User user={user}/>}
                <FriendsList setDataFromUrl={setDataFromUrl} />
            </div>
        </div>
    </div>
  )
}
