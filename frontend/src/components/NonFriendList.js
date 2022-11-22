import React, { useEffect, useState } from "react";

export default function NonFriendList({ users, setUsers, friends }) {
  const [error, setError] = useState([]);
  const [unfilteredUsers, setUnfilteredUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/all/excluding-friends",
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
        setUsers(data.users);
        setUnfilteredUsers(data.users);
        //console.log(data.users);
      } else {
        setError(data.message);
      }
    };
    getUsers();
  }, [setUsers, friends]);

  const addFriend = async (friend) => {
    const senderID = localStorage.getItem("userID");
    if (localStorage.getItem("userID")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/${senderID}/friend-request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ friendID: friend._id }),
          }
        );
        const data = await response.json();
        if (data.success === true) {
          setUsers(users.filter((user) => user._id !== friend._id));
        }
        console.log("Friend request sent");
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("You must be logged in to add friends");
    }
  };

  const filterUsers = (e) => {
    e.preventDefault();
    const search = e.target.searchterm.value;
    if (search.length > 0) {
      console.log(`searching for ${search}`);
      const filteredUsers = users.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())
        );
      });
      setUsers(filteredUsers);
    } else {
      // remove search filter
      setUsers(unfilteredUsers);
    }
  };

  return (
    <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto p-4 my-5 w-full shadow-md bg-white rounded-lg md:max-w-[750px]">
      <h2 className="font-medium mb-2">All Other Users - make new friends!</h2>
      <form onSubmit={filterUsers}>
        <input
          className="rounded-full py-1 px-2 text-gray-500 outline-none border"
          type="text"
          name="searchterm"
          placeholder="Search Users"
        />
      </form>
      {users.map((user) => {
        return (
          <div key={user._id} className="flex justify-between my-2">
            <div className="flex flex-1 space-x-3 items-center mb-2 hover:bg-gray-100 rounded-lg hover:font-medium">
              <img
                src={user.profileImage}
                referrerPolicy="no-referrer"
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              ></img>
              <p className="">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <button
                onClick={() => addFriend(user)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow-lg"
              >
                Send Friend Request
              </button>
            </div>
          </div>
        );
      })}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
