import React, { useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { PencilIcon } from '@heroicons/react/24/outline';
import { CameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

export default function InputBox() {
    const [errors, setErrors] = useState(null);
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [imgURL, setImgURL] = useState("");
    const CLOUDINARY_ENDPOINT='https://api.cloudinary.com/v1_1';
    const inputRef = useRef(null);
    const imgInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // check to see if we have a post body, return if not
        if (!inputRef.current.value){
            console.log('no post body');
            return;
        } 
        
        // check if we have an image, if so, upload it to cloudinary
        if(image){ 
            //upload image to Cloudinary
            console.log('uploading image');
            try{
                const imgData = new FormData();
                imgData.append("file", image);
                imgData.append("upload_preset", "rgydp4v2");
                const imgResponse = await fetch(`${CLOUDINARY_ENDPOINT}/duzlvcryq/image/upload`,
                    {
                        method: 'POST',
                        body: imgData
                    });
                const imgJson = await imgResponse.json();
                // console.log(imgJson);
                const imgURLvalue = await imgJson.secure_url;
                setImgURL(imgURLvalue);
                // console.log(`The imageURL is: ${imgURL}`);
            } catch(err){
                console.log(err);
                setErrors(err);
            }
        }

        //send post data to server
        try{
            const response = await fetch('http://localhost:3000/api/v1/post/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        content: e.target.content.value,
                        imgURL: imgURL
                    })
                });
            const data = await response.json();
            if (data.success === true){
                toast.success('Post created successfully');
            } else{
                toast.error(data.message);
            }
            console.log(data);
        } catch(err){
            console.log(err);
            setErrors(err);
        }
        // reset form
        inputRef.current.value = "";
        imgInputRef.current.value = null;
        removeImage();
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

    const removeImage = () => {
        setImgPreview(null);
    }


  return (
    <>
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
        <div className='bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6'>   
            {/* Top half */}
            <div className='flex space-x-4 p-4 items-center justify-between'>
                <PencilIcon height={40} width={40}/>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-1'>
                    <input ref={inputRef} name="content" id="content" type="text" placeholder="What's on your mind?" 
                    className='rounded-full h-12 bg-gray-100 flex-grow px-2 outline-none'/>
                    {/* <button onSubmit={(e) => handleSubmit(e)} className='hidden' type="submit"></button> */}
                </form>
                {imgPreview && (
                    <div onClick={removeImage} className="flex flex-col text-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer" >
                        <img src={imgPreview} alt="post preview" height={60} width={60} className='rounded-3xl overflow-hidden'/>
                        <p className="text-red-500 hover:text-red-700">Remove</p>
                    </div>
                )}
            </div>
            
            {/* Bottom half */}
            <div className='flex justify-evenly p-3 border-t'>
                <div className='inputIcon' onClick={() => imgInputRef.current.click()}>
                    <CameraIcon className='h-7 text-red-500'/>
                    <p className='text-xs sm:text-sm xl:text-base' >Picture</p>
                    {/* <input ref={imgInputRef} className='hidden' id="inputTag" type="file"  onChange={(e) => {setImage(e.target.files[0])}}/> */}
                    <input ref={imgInputRef} className='hidden' id="inputTag" type="file"  
                    onChange={(e) => {
                        addImageToPost(e);
                        setImage(e.target.files[0]);
                    }}/>
                </div>
                <div className='inputIcon'>
                    <ChatBubbleLeftIcon className='h-7 text-red-500'/>
                    <p className='text-xs sm:text-sm xl:text-base' >Text</p>
                </div>
            </div>
        </div>
        {errors && <p>{errors}</p>}
    </>
  )
}
