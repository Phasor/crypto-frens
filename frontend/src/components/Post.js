import React, { useState } from 'react'

export default function Post({setPosts, post}) {
    const [comment, setComment] = useState('');

    const postComment = async (e) => {
        e.preventDefault();
        console.log(`Post ID: ${post._id}`);
        const postID = post._id;
        try{
            const response = await fetch(`http://localhost:3000/api/v1/post/${postID}/comment`,
                {method: 'POST',
                headers: {'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`},
                body: JSON.stringify({
                    comment: comment,
                    date: Date.now(),
                })
            });
            setComment('');
            const data = await response.json();
            console.log(data);
            if(data.success){
                // refresh the posts to show the new comment
                const refreshedPosts = await fetch(
                    'http://localhost:3000/api/v1/post/all',
                    {type: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${localStorage.getItem('token')}`
                        }
                    }
                );
                const refreshedPostsJson = await refreshedPosts.json();
                setPosts(refreshedPostsJson.posts);
            }
        } catch(err){
            console.log(err);
        }
    }
    

  return (
    <>
        <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>{post.author.username}</p>
            <p>{post.posted}</p>
            <p>Likes: {post.length}</p>
        </div>
        <div>
            <form onSubmit={postComment}>
                <input placeholder="leave comment..." type="text" name="comment" id="comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button type="submit" onClick={postComment}>Comment</button>
            </form>
        </div>
        <div>
            <p>Comments</p>
            <p>____________________________________________</p>
            {post.comments.map((comment) => (
                <div key={comment._id}>
                    <p>{comment.comment}</p>
                    <p>{comment.author.username}</p>
                    <p>{comment.date}</p>
                    <p>----------------------</p>
                </div>
            ))}
        </div>
    </>
  )
}
