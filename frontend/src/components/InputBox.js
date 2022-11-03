import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ToastContainer, toast } from 'react-toastify';
import { PencilIcon } from '@heroicons/react/24/outline';
import { CameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';


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
        <div className='bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6'>   
            <div className='flex space-x-4 p-4 items-center'>
                <PencilIcon height={20} width={20}/>
                <form className='flex flex-1'>
                    <input type="text" placeholder="What is on your mind?" 
                    className='rounded-full h-12 bg-gray-100 flex-grow px-2 outline-none'/>
                <button onSubmit={handleSubmit} className='hidden' type="submit"></button>
                </form>
            </div>

            <div className='flex justify-evenly p-3 border-t'>
                <div className='inputIcon'>
                    <CameraIcon className='h-7 text-red-500'/>
                    <p className='text-xs sm:text-sm xl:text-base' >Picture</p>
                </div>
                <div className='inputIcon'>
                    <ChatBubbleLeftIcon className='h-7 text-red-500'/>
                    <p className='text-xs sm:text-sm xl:text-base' >Text</p>
                </div>
                
            </div>



        </div>

    // <div>
    //         <ToastContainer
    //             position="top-center"
    //             autoClose={5000}
    //             hideProgressBar
    //             newestOnTop={false}
    //             closeOnClick
    //             rtl={false}
    //             pauseOnFocusLoss
    //             draggable
    //             pauseOnHover
    //             theme="light"
    //         />
    //         <form onSubmit={handleSubmit}>
    //             <label htmlFor="title">Title</label>
    //             <input type="text" name="title" id="title" placeholder='Title'/>
    //             <br/>
    //             <label htmlFor="content">Content</label>
    //             <textarea rows="10" cols="100 "name="content" id="content" placeholder='Content'/>
    //             <br/>
    //             <p>Upload Image:</p>
    //             <input type="file"  onChange={(e) => {setImage(e.target.files[0])}}/>
    //             <br/>
    //             <br/>
    //             <button type="submit">Post</button>
    //         </form>
    //     </div>
  )
}
