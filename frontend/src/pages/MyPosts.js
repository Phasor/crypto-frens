import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import formatDate from '../utils/formatDate'

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
        <NavBar/>
        <h1>My Posts</h1>
        {posts.map((post) => {
            return (
                <div key={post._id}>
                    <h2>{post.title}</h2>
                    {post.imgURL && <img src={post.imgURL} alt={post.title}/>}
                    <p>{post.content}</p>
                    <p>{formatDate(post.posted)}</p>
                    <p>Likes: {post.likes.length}</p>
                </div>
            )
        })}
        {errors ? <p>{errors}</p> : null}
    </div>
  )
}
