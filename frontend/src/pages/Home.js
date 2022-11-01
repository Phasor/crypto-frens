import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar';
import PostList from '../components/PostList';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
    const username = localStorage.getItem('username');
    const [tokenGoog, setTokenGoog] = useState('');
    // const [googUser, setGoogUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const setDataFromUrl = async () => {
            if(location.search){ // there is a query string, hence this is a Google auth login   
                const rawData = location.search.split("=")[1];
                const removedFirstName = rawData.split("&")[0];
                const tokenValue =  removedFirstName.replace("%20", " ");
                // console.log(`tokenValue: ${tokenValue}`);
                setTokenGoog(tokenValue);
                localStorage.setItem("token", tokenGoog);
                const firstNameValue = location.search.split("=")[2];
                setFirstName(firstNameValue);
                const userIDValue = location.search.split("=")[3];
                localStorage.setItem("userID", userIDValue);
            }
        }
        setDataFromUrl();
    }, [tokenGoog, location.search]);


    // // get user from google oauth if required
    // useEffect(() => {
    //     const getUser = async () => {
    //         const response = await fetch("http://localhost:3000/api/v1/auth/login/success", {
    //             method: "GET",
    //             credentials: "include",
    //             headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Credentials": true,
    //             },
    //         })
    //         if (response.status === 200){
    //             const fetchedUser = await response.json();
    //             console.log('user', fetchedUser);
    //             setGoogUser(fetchedUser);
    //         } 
    //         else{
    //             throw new Error("authentication has been failed!");
    //         }
    //     };
    //     getUser();
    //   }, []);

  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <h1>Home</h1>
                {firstName ? <p>Welcome {firstName}</p> : <p>Welcome {username}</p>}
                <Link to="/post/create"><button>Create Post</button></Link>
                <PostList/>
            </div>
        </div>
    </div>
  )
}
