import React, { useState } from 'react';
import formatDate from '../utils/formatDate';

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

    const likePost = async (e) => {
        try{
            const response = await fetch(`http://localhost:3000/api/v1/post/${post._id}/like`,
                {method: 'POST',
                headers: {'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`},
            });
            const data = await response.json();
            console.log(data);
            if(data.success){
                // refresh the posts to show the new like
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
        }catch(err){
            console.log(err);
        }
    }

    

  return (
    <div className='flex flex-col'>
        <div className='bg-white p-2 mt-5 rounded-t-xl shadow-md '>
            <div className='relative h-56 md:h-96 bg-white'>
                {post.imgURL && <img src={post.imgURL} alt="" layout="fill" className='object-cover'/>}
            </div>
            <p className='p-2 font-medium'>{post.content}</p>
            <p className='p-2 font-medium'>{post.author.username}</p>
        </div>
    </div>

    // <div className="flex flex-col">
    //     <div>
    //         <h2>{post.title}</h2>
    //         <img src={post.imgURL} alt="" />
    //         <p>{post.content}</p>
    //         <p>{post.author.username}</p>
    //         <p>{formatDate(post.posted)}</p>
    //         <p>Likes: {post.likes.length}</p>
    //     </div>
    //     <div><button onClick={likePost}>Like</button></div>
    //     <div>
    //         <form onSubmit={postComment}>
    //             <input placeholder="leave comment..." type="text" name="comment" id="comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
    //             <button type="submit" onClick={postComment}>Comment</button>
    //         </form>
    //     </div>
    //     <div>
    //         <p>Comments</p>
    //         <p>____________________________________________</p>
    //         {post.comments.map((comment) => (
    //             <div key={comment._id}>
    //                 <p>{comment.comment}</p>
    //                 <p>{comment.authorEmail.username}</p>
    //                 <p>{formatDate(comment.date)}</p>
    //                 <p>----------------------</p>
    //             </div>
    //         ))}
    //     </div>
    // </div>
  )
}
