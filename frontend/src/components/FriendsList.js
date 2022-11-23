import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FriendsList({ setDataFromUrl }) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            await setDataFromUrl();
            const userID = localStorage.getItem("userID");
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/user/${userID}/getFriends`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            const data = await response.json();
            // console.log(data);
            setFriends(data.friends);
        };
        getFriends();
    }, [setDataFromUrl]);

    return (
        <div>
            <div className="hidden lg:flex flex-col w-60 p-2 mt-5">
                <h2 className="p-2 font-medium text-gray-500">Contacts</h2>
                {friends &&
                    friends.map((friend) => (
                        <Link
                            to={`${process.env.REACT_APP_FRONTEND_BASE_URL}/user/${friend._id}`}
                            key={friend._id}
                        >
                            <div className="flex space-x-2 p-1 border-b md:min-w-[200px] rounded-2xl hover:bg-gray-200 cursor-pointer ">
                                <div>
                                    <img
                                        src={friend.profileImage}
                                        referrerPolicy="no-referrer"
                                        alt=""
                                        className="p-2 rounded-full h-12 w-12 object-cover"
                                    />
                                </div>
                                <p className=" text-gray-500 p-2 font-medium">
                                    {friend.firstName} {friend.lastName}
                                </p>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
