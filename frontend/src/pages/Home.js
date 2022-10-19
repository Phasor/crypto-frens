import React, {useState, useEffect} from 'react'
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

export default function Home() {
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [errors, setErrors] = useState(null);
const [comment, setComment] = useState('');

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
},[])

const postComment = async (e, post) => {
    e.preventDefault();
    const postID = post._id;
    try{
        const response = await fetch(`http://localhost:3000/api/v1/post/${postID}/comment`,
            {method: 'POST',
            headers: {'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`},
            body: JSON.stringify({
                content: e.target.comment.value,
                date: new Date().toISOString(),
            })
        });
        const data = await response.json();
        console.log(data);
        if(data.success){
            window.location.reload();
        }
    } catch(err){
        console.log(err);
    }
}

const handleCommentChange = (e) => {
    setComment(e.target.value);
}


  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <h1>Home</h1>
                <Link to="/post/create"><button>Create Post</button></Link>
                {loading ? <p>Loading...</p> : 
                    posts.map((post) => (
                        <>
                            <div key={post._id}>
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                                <p>{post.author.username}</p>
                                <p>{post.posted}</p>
                                <p>Likes: {post.length}</p>
                            </div>
                            <div>
                                <form onSubmit={(e, {post}) => postComment(e, {post})}>
                                    <label>Comment: </label>
                                    <input type="text" name="comment" id="comment" value={comment} onChange={handleCommentChange}></input>
                                    <button>Comment</button>
                                </form>
                            </div>
                            <div>
                                <p>Comments</p>
                                <p>____________________________________________</p>
                                {post.comments.map((comment) => (
                                    <div key={comment._id}>
                                        <p>{comment.content}</p>
                                        <p>{comment.author.username}</p>
                                        <p>{comment.date}</p>
                                        <p>----------------------</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ))
                }
                {errors && <p>{errors}</p>}
            </div>
        </div>
    </div>
  )
}
