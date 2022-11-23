import React, { useState, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HomeIcon, UsersIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import HeaderIcon from "./HeaderIcon";

export default function NavBar({ setDataFromUrl }) {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useLayoutEffect(() => {
        const checkLoggedIn = async () => {
            if (typeof setDataFromUrl !== "undefined") await setDataFromUrl();
            if (localStorage.getItem("token")) {
                setLoggedIn(true);
            }
        };
        checkLoggedIn();
    }, [setDataFromUrl]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        localStorage.removeItem("shortName");
        localStorage.removeItem("username");
        setTimeout(() => navigate("/login"), 1000);
    };

    return (
        <div className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md">
            {/* left */}
            <div className="flex items-center">
                <div className="rounded-full overflow-hidden flex-shrink-0">
                    {loggedIn ? (
                        <Link to="/home">
                            <img
                                src="/cryptoFrensLogo.png"
                                alt="logo"
                                width={45}
                                height={45}
                            />
                        </Link>
                    ) : (
                        <Link to="/">
                            <img
                                src="/cryptoFrensLogo.png"
                                alt="logo"
                                width={45}
                                height={45}
                            />
                        </Link>
                    )}
                </div>
                <div className="hidden md:flex md:ml-2 md:items-center md:rounded-full bg-gray-100 p-3">
                    <MagnifyingGlassIcon className="h-6 text-gray-600" />
                    <input
                        type="text"
                        placeholder="Search CryptoFrens"
                        className="flex-shrink ml-2 items-center bg-transparent outline-none placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Centre */}
            <div className="flex justify-center flex-grow">
                {loggedIn && (
                    <div className="flex space-x-6 md:space-x-2">
                        <Link to="/home">
                            <HeaderIcon active={true} Icon={HomeIcon} />
                        </Link>
                        <Link to="/users">
                            <HeaderIcon Icon={UsersIcon} />
                        </Link>
                        <Link to="/settings">
                            <HeaderIcon Icon={Cog8ToothIcon} />
                        </Link>
                    </div>
                )}
            </div>

            {/* right */}
            <div className="flex items-center sm:space-x-2 whitespace-nowrap">
                {loggedIn ? (
                    <button
                        onClick={logout}
                        className="w-[80px] bg-gray-400 rounded-lg text-white p-2 ml-4 hover:bg-blue-500"
                    >
                        Log Out
                    </button>
                ) : (
                    <>
                        <Link to="/login">
                            <button
                                data-test="nav-login-button"
                                className="w-[80px] bg-gray-400 rounded-lg text-white p-2 hover:bg-blue-500"
                            >
                                Log In
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button
                                data-test="nav-signup-button"
                                className="w-[80px] bg-gray-400 rounded-lg text-white p-2 ml-4 hover:bg-blue-500"
                            >
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
