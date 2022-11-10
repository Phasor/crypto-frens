import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import NavBar from '../components/NavBar'

export default function SignUp() {
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const CLOUDINARY_ENDPOINT='https://api.cloudinary.com/v1_1';
    const title = "Crypto Frens - Sign Up";

    useEffect(() => {
      document.title = title;
    }, [title]);

    const submitHandler = async (e) => {
        e.preventDefault();
        // upload profile image if required
        let imgURL = "";
        if (image){
            imgURL = await UploadImage(image); // returns image URL on Cloudinary
        }
        try{
            const response = await fetch('http://localhost:3000/api/v1/user/signup', 
                {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName: e.target.firstName.value,
                    lastName: e.target.lastName.value,
                    shortName: e.target.shortName.value,
                    username: e.target.username.value,
                    password: e.target.password.value,
                    profileImage: imgURL,
                })
            });
            const data = await response.json();
            if(data.success === true){
                console.log(`data: ${data}`);
                setTimeout( () => navigate('/'), 2000 );
            }
            else{
                setError(data.errors);
            }
        } catch(err){
            console.log(err);
            setError(err);
        }
    }

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setImgPreview(readerEvent.target.result);
        }
    }

    const UploadImage = async (image) => {
        console.log('uploading image');
        const formData = new FormData();
        formData.append('file', image);
        formData.append("upload_preset", "rgydp4v2");
        try{
            const response = await fetch(`${CLOUDINARY_ENDPOINT}/duzlvcryq/image/upload`,
                {
                    method: 'POST',
                    body: formData
                });
            const data = await response.json();
            console.log(data);
            return data.secure_url;
        } catch(err){
            console.log(err);
            setError(err);
        }
    }

    const removeImage = () => {
        setImgPreview(null);
    }

  return (
    <div className='w-full h-screen'>
        <NavBar/>
        <div className='w-full flex justify-center items-center'>
            <form className='flex flex-col w-[90%] md:w-[50%] lg:w-[30%] xl:w-[25%] mt-6 lg:mt-20 rounded-lg bg-white shadow-lg' onSubmit={submitHandler}>
                <h1 className='font-medium text-xl px-4 py-2' >Sign Up</h1>
                <div className='px-8 py-2 flex flex-col'>
                    <label htmlFor="firstName">First Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="firstName" id="firstName" placeholder='Benjamin'/>
                    <label htmlFor="lastName">Last Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="lastName" id="lastName" placeholder='Smith'/>
                    <label htmlFor="shortName">Short Name</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="shortName" id="shortName" placeholder='Ben'/>
                    <label htmlFor="username">Email</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="email" name="username" id="username" placeholder='ben@test.com'/>
                    <label htmlFor="password">Password</label>
                    <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="password" name="password" id="password" placeholder='password'/>
                    
                    {/* Image uploader */}
                    <div className='flex items-center space-x-5'>
                        <div onClick={() => imageRef.current.click()} className="font-medium mb-2 cursor-pointer py-1" >
                                <div className='flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-xl px-1 py-2'>
                                    <p>Upload Profile Image</p>
                                    <ArrowUpTrayIcon className='h-6 w-6'/>
                                </div>
                                <input ref={imageRef} className="hidden" type="file" id="inputTag" name="profileImage"
                                    onChange={(e)=>{
                                        addImageToPost(e);
                                        setImage(e.target.files[0]);
                                    }}
                                />
                        </div>
                        {imgPreview && (
                            <div onClick={removeImage} className="flex flex-col items-center text-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer" >
                                <img src={imgPreview} alt="post preview" height={40} width={40} className='rounded-2xl overflow-hidden'/>
                                <p className="text-red-700 hover:text-red-800">Remove</p>
                            </div>
                        )}
                    </div>
                    
                    <button className='bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg shadow px-2 py-1 mb-2 text-lg mt-2' type="submit">Sign Up</button>
                </div>
            </form>
            {error ? <p>{error}</p> : null}
        </div>
        
    </div>
  )
}

// firstName: { type: String, required: true },
// lastName: { type: String, required: true },
// shortName: { type: String, required: true },
// username: { type: String, required: true },
// password: { type: String, required: true },
// joinDate: { type: Date, default: Date.now },
// birthDay: { type: Date, required: false },
// profileImage: { type: String, data: Buffer, required: false },
// pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
// friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],