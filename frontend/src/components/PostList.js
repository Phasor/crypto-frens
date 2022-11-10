import React, { useState, useEffect } from 'react'
import { Bars } from  'react-loader-spinner'
import Post from '../components/Post'

export default function PostList({refreshFeed}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    

    useEffect(() => {

        const getPosts = async () => {
            const response = await fetch(
                'http://localhost:3000/api/v1/post/all',
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
        getPosts();
    }, [refreshFeed]);

  return (
    <div className='mt-8'>
        {loading ? 
            // loading spinner 
            <div className='flex justify-center items-center mt-20'>
            <Bars
                height="60"
                width="60"
                color="#4fa94d"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            </div>
        
         : 
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
  )
}
