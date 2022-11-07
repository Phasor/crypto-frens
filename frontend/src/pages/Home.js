import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import FriendsList from '../components/FriendsList';

export default function Home() {
    const [tokenGoog, setTokenGoog] = useState('');
    const [firstName, setFirstName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const setDataFromUrl = async () => {
            if(location.search){ // there is a query string, hence this is a Google auth login, not a local auth login
                const rawData = location.search.split("=")[1];
                const firstElem = rawData.split("&")[0];
                const tokenValue =  firstElem.replace("%20", " ");
                // console.log(`tokenValue: ${tokenValue}`);
                setTokenGoog(tokenValue);
                localStorage.setItem("token", tokenGoog);
                const firstNameRaw = location.search.split("=")[2];
                const firstNameValue = firstNameRaw.split("&")[0];
                setFirstName(firstNameValue);
                const userIDValue = location.search.split("=")[3];
                localStorage.setItem("userID", userIDValue);
            }
        }
        setDataFromUrl();
    }, [tokenGoog, location.search]);

  return (
    <div>
        <div>
            <NavBar/>
            <div className='w-full h-screen flex justify-center'>
                <Sidebar/>
                <Feed/>
                <FriendsList/>
            </div>
        </div>
    </div>
  )
}
