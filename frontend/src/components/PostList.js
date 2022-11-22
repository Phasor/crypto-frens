import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import Post from "../components/Post";

export default function PostList({ refreshFeed, setDataFromUrl }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const getPosts = async () => {
            await setDataFromUrl();
            console.log(`base url: ${process.env.REACT_APP_BASE_URL}`);
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/post/all`,
                {
                    type: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setPosts(data.posts);
                setLoading(false);
            } else {
                setErrors(data.message);
                setLoading(false);
            }
        };
        getPosts();
    }, [refreshFeed, setDataFromUrl]);

    return (
        <div className="mt-8" data-test="post-list">
            {loading ? (
                // loading spinner
                <div className="flex justify-center items-center mt-20">
                    <Bars
                        height="60"
                        width="60"
                        color="#4fa94d"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            ) : (
                posts.map((post) => (
                    <Post key={post._id} post={post} setPosts={setPosts} />
                ))
            )}
            {errors && <p>{errors}</p>}
        </div>
    );
}
