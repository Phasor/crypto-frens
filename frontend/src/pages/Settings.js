import React, { useEffect, useState, useRef } from 'react'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';

export default function Settings() {
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [shortName, setShortName] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const CLOUDINARY_ENDPOINT='https://api.cloudinary.com/v1_1';
    const title = "Crypto Frens - Update Profile";


    useEffect(() => {
      document.title = title;
    }, [title]);

    useEffect(() => {
        // fetch user data
        const userID = localStorage.getItem('userID');

        const getUserData = async () => {
            try{
                const response = await fetch(`http://localhost:3000/api/v1/user/${userID}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                    });
                const data = await response.json();
                // console.log(`data: ${JSON.stringify(data)}`);
                if(data.success === true){
                    // set current values in form
                    setFirstName(data.user.firstName);
                    setLastName(data.user.lastName);
                    setShortName(data.user.shortName);
                    setUsername(data.user.username);
                    setImgPreview(data.user.profileImage);
                } else{
                    setError(data.errors);
                }
            }catch(err){
                console.log(err);
            }
        }
        getUserData();
    }, []);
        
    const submitHandler = async (e) => {
        e.preventDefault();
        // upload profile image if required
        let imgURL = "";
        if (image){
            imgURL = await UploadImage(image); // returns image URL on Cloudinary
        }
        try{
            const userID = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3000/api/v1/user/${userID}`, 
                {method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')},
                body: JSON.stringify({
                    firstName: e.target.firstName.value,
                    lastName: e.target.lastName.value,
                    shortName: e.target.shortName.value,
                    username: e.target.username.value,
                    profileImage: imgURL,
                })
            });
            const data = await response.json();
            if(data.success === true){
                console.log(`data: ${data}`);
                toast.success('Profile updated successfully');
                setTimeout( () => navigate('/home'), 1000 );
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
            <NavBar/>
            <div className='w-full flex justify-center items-center'>
                <form className='flex flex-col w-[90%] md:w-[50%] lg:w-[30%] xl:w-[25%] mt-6 lg:mt-20 rounded-lg bg-white shadow-lg' onSubmit={submitHandler}>
                    <h1 className='font-medium text-xl px-4 py-2' >Update Profile</h1>
                    <div className='px-8 py-2 flex flex-col'>
                        <label htmlFor="firstName">First Name</label>
                        <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="firstName" id="firstName" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} />
                        <label htmlFor="lastName">Last Name</label>
                        <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => {setLastName(e.target.value)}} />
                        <label htmlFor="shortName">Short Name</label>
                        <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="text" name="shortName" id="shortName" value={shortName} onChange={(e) => {setShortName(e.target.value)}}/>
                        <label htmlFor="username">Email</label>
                        <input className='rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border' type="email" name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value)}}/>

                        {/* Image uploader */}
                        <div className='flex items-center space-x-5'>
                            <div onClick={() => imageRef.current.click()} className="font-medium mb-2 cursor-pointer py-1" >
                                    <div className='flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-xl px-1 py-2'>
                                        <p>Upload Profile Image</p>
                                        <ArrowUpTrayIcon className='h-6 w-6'/>
                                    </div>
                                    <input ref={imageRef} className="hidden" type="file" id="inputTag" name="profileImage" value=""
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
                        
                        <button className='bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg shadow px-2 py-1 mb-2 text-lg mt-2' type="submit">Update</button>
                    </div>
                </form>
                {error ? <p>{error}</p> : null}
            </div>
            
        </div>
  )
}
