import React, {useState, useEffect} from 'react'

export default function Home() {
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const getPosts = async () => {
        const response = await fetch(
            'http://localhost:3000/api/v1/post/all',
            {type: 'GET', 
                headers: {'Content-Type': 'application/json'}
            });
        const data = await response.json();
        setPosts(data.posts);
        setLoading(false);
    }
    getPosts();
})


  return (
    <div>
        <div>
            <div>
                <h1>Home</h1>
                {loading ? <p>Loading...</p> : 
                    posts.map((post) => (
                        <div key={post._id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <p>{post.author}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}
