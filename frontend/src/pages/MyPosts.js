import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import formatDate from '../utils/formatDate'
import Sidebar from '../components/Sidebar';
import FriendsList from '../components/FriendsList';
import MyPostList from '../components/MyPostList';

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState(null);

useEffect(()=> {
    const getPosts = async () => {
        try{
            const userID = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3000/api/v1/post/user/${userID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success){
                setPosts(data.posts);
            } else{
                setErrors(data.message);
            }
        } catch(err){
            setErrors(err.message);
        }
    }
    getPosts();
},[])


  return (
    <div>
    <div>
        <NavBar/>
        <div className='w-full h-screen flex justify-center'>
            <Sidebar/>
            <MyPostList/>
            <FriendsList />
        </div>
    </div>
</div>
  )
}
