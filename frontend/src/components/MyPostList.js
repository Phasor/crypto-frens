import React, { useState, useEffect } from 'react'
import Post from '../components/Post'

export default function MyPostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    

    useEffect(() => {
        const userID = localStorage.getItem('userID');
        const getPosts = async (userID) => {
            const response = await fetch(
                `http://localhost:3000/api/v1/post/user/${userID}`,
                {type: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
            const data = await response.json();
            if (data.success){
                setPosts(data.posts);
                setLoading(false);
            } else {
                setErrors(data.message);
                setLoading(false);
            }
        }
        getPosts(userID);
    }, []);

  return (
    <div className='flex-grow h-screen pt-6 pb-6 bg-gray-100 overflow-y-auto scrollbar-hide'>
        <div className='mx-auto max-w-md md:max-w-lg lg:max-w-2xl'>
            {loading ? <p>Loading...</p> : 
                posts.map((post) => (
                    <Post
                        key={post._id} 
                        post={post} 
                        setPosts={setPosts}
                    />
                ))
            }
            {errors && <p>{errors}</p>}
        </div>
    </div>
  )
}
