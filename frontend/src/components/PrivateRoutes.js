import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function PrivateRoutes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const API_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:3002";

    const token = window.localStorage.getItem("token") || "";

    useEffect(() => {
        const isAuth = async () => {
            const response = await fetch(`${API_URL}/user/authcheck`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });

            const data = await response.json();
            if (data.success) {
                if (data.user === localStorage.getItem("userID")) {
                    setIsLoggedIn(true);
                    setIsChecking(false);
                    return;
                }
            }
        };
        isAuth();
    }, [token, API_URL]);

    if (isChecking)
        return (
            <div>
                <NavBar />
                <p className="w-full h-screen p-8 text-center">
                    Trying to log you in. Please wait...
                </p>
            </div>
        );

    return isLoggedIn ? <Outlet /> : <Navigate to={"/"} />;
}
