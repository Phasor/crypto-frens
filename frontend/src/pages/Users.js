import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import CurrentFriendsList from "../components/CurrentFriendsList";
import FriendRequestsList from "../components/FriendRequestsList";
import NonFriendList from "../components/NonFriendList";
import FriendsSentList from "../components/FriendsSentList";
import { useLocation } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingFriendsReceived, setPendingFriendsReceived] = useState([]);
    const location = useLocation();

    const setDataFromUrl = async () => {
        if (location.search) {
            // there is a query string, hence this is a Google auth login, not a local auth login
            const rawData = location.search.split("=")[1];
            const firstElem = rawData.split("&")[0];
            const tokenValue = firstElem.replace("%20", " ");
            // console.log(`tokenValue: ${tokenValue}`);
            // setTokenGoog(tokenValue);
            localStorage.setItem("token", tokenValue);
            const userIDValue = location.search.split("=")[3];
            localStorage.setItem("userID", userIDValue);
        }
    };

    return (
        <div>
            <NavBar setDataFromUrl={setDataFromUrl} />
            <div className="flex">
                {/* Sidebar */}
                <Sidebar setDataFromUrl={setDataFromUrl} />

                {/* Center Panel */}
                <div className="flex flex-col flex-grow p-3 items-center md:mt-10 max-h-screen overflow-y-scroll scrollbar-hide">
                    <CurrentFriendsList
                        friends={friends}
                        setFriends={setFriends}
                        pendingFriendsReceived={pendingFriendsReceived}
                    />
                    <FriendRequestsList
                        pendingFriendsReceived={pendingFriendsReceived}
                        setPendingFriendsReceived={setPendingFriendsReceived}
                    />
                    <FriendsSentList users={users} />
                    <NonFriendList
                        users={users}
                        setUsers={setUsers}
                        friends={friends}
                    />
                </div>
            </div>
        </div>
    );
}
