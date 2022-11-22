import React, { useState, useEffect } from "react";

export default function FriendsSentList({ users }) {
    const [pendingFriendsSent, setPendingFriendsSent] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPendingFriendsSent = async () => {
            const userID = localStorage.getItem("userID");
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/user/${userID}/getPendingFriendsSent`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    setPendingFriendsSent(data.pendingFriends);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        getPendingFriendsSent();
    }, [users]);

    return (
        <div className="p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]">
            <h2 className="font-medium mb-2">Friend Requests Sent</h2>
            {pendingFriendsSent.map((friend) => {
                return (
                    <div className="flex space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium">
                        <img
                            src={friend.profileImage}
                            referrerPolicy="no-referrer"
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                        ></img>
                        <p>
                            {friend.firstName} {friend.lastName}
                        </p>
                    </div>
                );
            })}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
