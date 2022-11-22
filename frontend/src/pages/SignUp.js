import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { RotatingLines } from "react-loader-spinner";
import NavBar from "../components/NavBar";

export default function SignUp() {
    const [errors, setErrors] = useState(null);
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const title = "Crypto Frens - Sign Up";

    useEffect(() => {
        document.title = title;
    }, [title]);

    const submitHandler = async (e) => {
        e.preventDefault();
        // upload profile image if required
        let imgURL = "";
        if (image) {
            imgURL = await UploadImage(image); // returns image URL on Cloudinary
        }
        try {
            // check if image uploaded, if it is then pass profileImg value, else not (default will be used)
            let response = {};
            if (imgURL === "") {
                response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/user/signup`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            firstName: e.target.firstName.value,
                            lastName: e.target.lastName.value,
                            shortName: e.target.shortName.value,
                            username: e.target.username.value,
                            password: e.target.password.value,
                        }),
                    }
                );
            } else {
                response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/user/signup`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            firstName: e.target.firstName.value,
                            lastName: e.target.lastName.value,
                            shortName: e.target.shortName.value,
                            username: e.target.username.value,
                            password: e.target.password.value,
                            profileImage: imgURL,
                        }),
                    }
                );
            }
            setLoading(true);
            const data = await response.json();
            if (data.success === true) {
                // console.log(`data: ${JSON.stringify(data)}`);
                localStorage.setItem("token", data.user.token);
                localStorage.setItem("username", data.user.user.username);
                localStorage.setItem("userID", data.user.user._id);
                localStorage.setItem("shortName", data.user.user.shortName);
                setTimeout(() => navigate("/home"), 1000);
            } else {
                setErrors(data.errors);
            }
        } catch (err) {
            console.log(err);
            setErrors(err);
        }
    };

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setImgPreview(readerEvent.target.result);
        };
    };

    const UploadImage = async (image) => {
        // console.log('uploading image');
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "rgydp4v2");
        try {
            const response = await fetch(
                `${process.env.REACT_APP_CLOUDINARY_ENDPOINT}/duzlvcryq/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            console.log(data);
            return data.secure_url;
        } catch (err) {
            console.log(err);
            setErrors(err);
        }
    };

    const removeImage = () => {
        setImgPreview(null);
    };

    return (
        <div className="w-full h-screen">
            <NavBar />
            <div className="w-full flex justify-center items-center">
                <form
                    className="flex flex-col w-[90%] md:w-[50%] lg:w-[30%] xl:w-[25%] mt-6 lg:mt-20 rounded-lg bg-white shadow-lg"
                    onSubmit={submitHandler}
                >
                    <h1 className="font-medium text-xl px-4 py-2">Sign Up</h1>
                    <div className="px-8 py-2 flex flex-col">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            className="rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border"
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Benjamin"
                        />
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            className="rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border"
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Smith"
                        />
                        <label htmlFor="shortName">Short Name</label>
                        <input
                            className="rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border"
                            type="text"
                            name="shortName"
                            id="shortName"
                            placeholder="Ben"
                        />
                        <label htmlFor="username">Email</label>
                        <input
                            className="rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border"
                            type="email"
                            name="username"
                            id="username"
                            placeholder="ben@test.com"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            className="rounded-lg px-2 py-1 mb-3 outline-none text-gray-700 border"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                        />

                        {/* Image uploader */}
                        <div className="flex items-center space-x-5">
                            <div
                                onClick={() => imageRef.current.click()}
                                className="font-medium cursor-pointer"
                            >
                                <div className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-xl px-1 py-2">
                                    <p>Upload Profile Image</p>
                                    <ArrowUpTrayIcon className="h-6 w-6" />
                                </div>
                                <input
                                    ref={imageRef}
                                    className="hidden"
                                    type="file"
                                    id="inputTag"
                                    name="profileImage"
                                    onChange={(e) => {
                                        addImageToPost(e);
                                        setImage(e.target.files[0]);
                                    }}
                                />
                            </div>
                            {/* Loading spinner */}
                            {loading && (
                                <div className="flex items-center text-center justify-center">
                                    <RotatingLines
                                        strokeColor="grey"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="30"
                                        visible={true}
                                    />
                                </div>
                            )}
                            {/* Image preview */}
                            {imgPreview && (
                                <div
                                    onClick={removeImage}
                                    className="flex flex-col items-center text-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
                                >
                                    <img
                                        src={imgPreview}
                                        alt="post preview"
                                        height={40}
                                        width={40}
                                        className="rounded-2xl overflow-hidden"
                                    />
                                    <p className="text-red-700 hover:text-red-800">
                                        Remove
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg shadow px-2 py-1 my-4 text-lg"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
            {errors && (
                <div className="flex justify-center">
                    <ul className="text-red-500 text-lg font-medium mt-5">
                        {errors.map((error, index) => {
                            return <li key={index}>{error.msg}</li>;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
