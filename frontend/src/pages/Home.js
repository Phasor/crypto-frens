import React from 'react'
import NavBar from '../components/NavBar';
import PostList from '../components/PostList';
import { Link } from 'react-router-dom';

export default function Home() {

  return (
    <div>
        <div>
            <NavBar/>
            <div>
                <h1>Home</h1>
                <Link to="/post/create"><button>Create Post</button></Link>
                <PostList/>
            </div>
        </div>
    </div>
  )
}
