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
                console.log(data.message);
            }
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    const testUserLogin = () => {
        localStorage.setItem(
            "token",
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzdiY2QwYzZmOTM4NzE2NjY0Njg0ZjgiLCJpYXQiOjE2NjkwNjkzNDI5NDUsImV4cCI6MTY2OTA2OTQyOTM0NX0.n1rjm4y0iTpo2Inuk-96iM2fTBwBeJZFrZzPERhYnR48q9jwXmMFkYG6IPXWZz_nmPR373XOiOBZRPdGhcAeq6VevOAPdavSAc92qShPjm_8U6nIz_JSBPwxolVxpNfCWi0zecq6LwVBPVincmMRIgvrOPidkAteEjRkkokgA3yqaEsZlHzoEsQ9W_WsyVJdfwLsSJHJ9mz4vEatdcn5j9b1rvX3gKsLttLD0g_obIs3cBxWbbgG2_tjJWOhJU2fdh2R91nIPRM9N-iYR1zLZxiObAVjnjl2pUFeOdFRz76xU26o1au8wlUBs3DBYD0IDSIFIRsaInn1oskOZnS7mt5U9djujsAMso9GvNKBC76H1muner1LqF4peq7wVRmA_C9iLQfiHwr-GXq-8TnMv_iXgJvYMGztB6czKuPtAgvrivhMF28NFyeQBE7nIQ4Qhr_5fUt7feyqfDbW5MrkQAeS-VIa5t-JHBCYYYemh5yYfLGGtHXZiA2PtRgLZaVrBofHMX40hISmFC09HP1r3OoZtj-nTgzd_YI7Ou2uYmvmPmT7Qf_PFRUlpr6KlevCE1fTXuWAAZ2SfuGSLqOlEbSVWFdV6khF1W3WMiEH2EogFH9p7wIsRT9FjSjlDwmUTguiIbcgrSdVSFhNa1cZgzPbUSKL5Zs8TpJjQqHL4JQ"
        );
        localStorage.setItem("username", "a@test.com");
        localStorage.setItem("userID", "637bcd0c6f938716664684f8");
        setTimeout(() => navigate("/home"), 1000);
    };

    return (
        <div>
            <div>
                <NavBar />
                <div className="w-full h-screen flex justify-center">
                    <div className="flex-col mt-20 p-4">
                        <div className="mb-10">
                            <h2 className="text-2xl">New?</h2>
                            <Link to="/signup">
                                <button className="mt-2 py-1 px-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg border">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                        <h2 className="text-2xl">Log In</h2>
                        <div className="flex border rounded-md mt-2 shadow-md p-2 bg-white">
                            <form
                                onSubmit={submitHandler}
                                className=" border rounded-md p-2 md:p-4 md:m-5 my-10"
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
                            <div className="flex mx-4 items-center justify-center  bg-gray-200 rounded-full w-[1px] my-3">
                                <p className="md:text-2xl">OR</p>
                            </div>
                            <div className="flex items-center md:p-4">
                                <GoogleLogin />
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-md">
                                Just looking around? Log in as test user below.
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
