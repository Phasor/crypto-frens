import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ToastContainer, toast } from 'react-toastify';

export default function InputBox() {
    const [errors, setErrors] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const CLOUDINARY_ENDPOINT='https://api.cloudinary.com/v1_1';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            //upload image to Cloudinary
            const imgData = new FormData();
            imgData.append("file", image);
            imgData.append("upload_preset", "rgydp4v2");
            const imgResponse = await fetch(`${CLOUDINARY_ENDPOINT}/duzlvcryq/image/upload`,
                {
                    method: 'POST',
                    body: imgData
                });
            const imgJson = await imgResponse.json();
            const imgURL = imgJson.secure_url;
            //console.log(imgJson);

            //send post data to server
            const response = await fetch('http://localhost:3000/api/v1/post/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        title: e.target.title.value,
                        content: e.target.content.value,
                        imgURL: imgURL
                    })
                });
            const data = await response.json();
            if (data.success === true){
                toast.success('Post created successfully');
                setTimeout( () => navigate('/home'), 2000 );
            }
            console.log(data);
        } catch(err){
            console.log(err);
            setErrors(err);
        }
    }


  return (
    <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder='Title'/>
                <br/>
                <label htmlFor="content">Content</label>
                <textarea rows="10" cols="100 "name="content" id="content" placeholder='Content'/>
                <br/>
                <p>Upload Image:</p>
                <input type="file"  onChange={(e) => {setImage(e.target.files[0])}}/>
                <br/>
                <br/>
                <button type="submit">Post</button>
            </form>
        </div>
  )
}
