import React from "react";

export default function GoogleLogin() {
    const handleGoogleLogin = async () => {
        try {
            window.open(
                `${process.env.REACT_APP_API_BASE_URL}/auth/google`,
                "_self"
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-w-[150px]">
            <img
                src="/googleSigninButton.png"
                alt="google sign in button"
                onClick={handleGoogleLogin}
                width={240}
                className="md:p-2 cursor-pointer hover:animate-pulse"
            />
        </div>
    );
}
