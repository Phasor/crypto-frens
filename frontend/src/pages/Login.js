import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import GoogleLogin from "../components/GoogleLogin";

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const title = "Crypto Frens - Log In";

    useEffect(() => {
        document.title = title;
    }, [title]);

    const submitHandler = async (e) => {
        e.preventDefault();
        // delete any local storage variables
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        localStorage.removeItem("username");
        localStorage.removeItem("shortName");

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: e.target.username.value,
                        password: e.target.password.value,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("userID", data.user._id);
                localStorage.setItem("shortName", data.user.shortName);
                setTimeout(() => navigate("/home"), 1000);
            } else {
                setError(data.message);
                // console.log(data.message);
            }
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    const testUserLogin = () => {
        localStorage.setItem(
            "token",
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzdkNTc4NDRlMzBkNWQwOTE1ZjVlZmUiLCJpYXQiOjE2NjkyNDEwNDE0NDgsImV4cCI6MTY2OTI0MTEyNzg0OH0.HeNdWkynSUTJYzZGHRwgD62q7Fl0RPM0hlsBFZklg-Nz4MlCGTbyPS-PiS4x_fVcJA6C2tu81XV5lHjABlcG707x1pX9rhMCoq7jsnobea84f2Qk80ZBtxJhT3gk1cNVKj8rJERMVSKhg0uQVUR54nbEUvvOoR48ZMgvPHXuSm3NuqWbuU0ihD4_xFpYBH2qd63xGfTw2DB1BakuN5rweRntWuqGcGLohTGRXaf3kwRE9puPCZmGWW8Q1Ww-LuAZNdNr6S50Y5_CucM7ZZA3sKsIlciOD-c5iRxW7K-Eqjj7uc2hWg6xy6Zp0OYRFXZV3dBYcGmo5gZNRp4Q2bGjR_r2vis8HxHsZnq9tPOgtZb2PmZvoFNdp8wXL41HdsLlM824_Mq1m-qbiPILBVwN3Tuszbj5OSZOyoO0qBUO8dDAXHfUwMgaa3XmOvOgse6ycbJN2a7z6DDxtdP6X5MTcrEZPT3aZuaWoxLrRE_U9DGJny4Klp2zpRP90z7RDjbHFK0BqLtWJa9HEnbDoUb-fjcD4vE8RP0RNDjm7aAVIQvWgHQQ-2masSbKYUmd06O3bVAYYi1t3nf3_20klq8swQK9RCCAlM2bSh9wspGCXricIIRECpo3pt_IhxAtGrmh4MklNCQ4-tvkYk3J2U2VJ1NXlkR8UH0puM3tOoH9t-A"
        );
        localStorage.setItem("username", "a@test.com");
        localStorage.setItem("userID", "637d57844e30d5d0915f5efe");
        setTimeout(() => navigate("/home"), 1000);
    };

    return (
        <div>
            <div className="h-screen">
                <NavBar />
                <div className="w-full h-[85%] flex flex-col md:flex-row md:justify-center overflow-y-auto">
                    <div className="flex-col mt-5 md:mt-20 p-4 landscape:mt-0">
                        <div className="mb-5 md:mt-10">
                            <h2 className="text-5xl text-center md:text-left font-bold ">
                                Meet People in Crypto.
                            </h2>
                            <Link to="/signup">
                                <button className="mt-10 py-1 px-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg border">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                        <h2 className="text-2xl mb-2">Log In</h2>
                        <div className="flex flex-col md:flex-row border rounded-md mt-1 shadow-md p-2 bg-white">
                            <form
                                onSubmit={submitHandler}
                                className="md:border rounded-md p-2 md:p-4 md:m-5 md:my-10"
                            >
                                <div className="flex items-center outline-none justify-between">
                                    <label htmlFor="username">Email</label>
                                    <input
                                        className="border rounded-md outline-none ml-2 p-1 text-gray-500"
                                        type="email"
                                        name="username"
                                        placeholder="ben@gmail.com"
                                        id="username"
                                    />
                                </div>
                                <div className="flex items-center outline-none justify-between mt-2">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        className="border rounded-md outline-none ml-2 p-1"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    data-test="login-button-main"
                                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 rounded-lg px-2 py-1  text-white shadow-lg border"
                                >
                                    Log In
                                </button>
                            </form>
                            <div className="flex mx-4 items-center justify-center font-medium md:bg-gray-200 rounded-full md:w-[1px] my-3">
                                <p className="md:text-2xl">OR</p>
                            </div>
                            <div className="flex  justify-center items-center md:p-4">
                                <GoogleLogin />
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-md">
                                Just looking around? Log in as a test user
                                below.
                            </p>
                            <button
                                onClick={testUserLogin}
                                className="bg-blue-500 hover:bg-blue-600 shadow-md border text-white px-2 py-1 rounded-lg mt-2"
                            >
                                Test User
                            </button>
                        </div>
                        {error && <p className="text-red-500 p-1">{error}</p>}
                    </div>
                    <br />
                </div>
            </div>
        </div>
    );
}
