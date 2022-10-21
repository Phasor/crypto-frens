import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function CreatePost() {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/api/v1/post/create',
                {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: e.target.title.value,
                    content: e.target.content.value,
                    author: e.target.author.value,
                })
            });
            const data = await response.json();
            if (data.success === true){
                setTimeout( () => navigate('/'), 2000 );
            }
            console.log(data);
        } catch(err){
            console.log(err);
            setErrors(err);
        }
    }


  return (
    <div>
        <div>
            <NavBar/>
            <Link to="/">Home</Link>
            <div>Create a Post</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder='Title'/>
                <br/>
                <label htmlFor="content">Content</label>
                <textarea rows="10" cols="100 "name="content" id="content" placeholder='Content'/>
                <br/>
                <label htmlFor="author">Author</label>
                <input type="text" name="author" id="author" placeholder='Author'/>
                <button type="submit">Post</button>
            </form>
            {errors ? <p>{errors}</p> : null}
        </div>
    </div>
  )
}
