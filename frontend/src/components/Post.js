import React, { useState } from 'react';
import formatDate from '../utils/formatDate';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';


export default function Post({setPosts, post}) {
    const [comment, setComment] = useState('');
    const [postLiked, setPostLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);

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
                setPostLiked(!postLiked);
            }
        }catch(err){
            console.log(err);
        }
    }

    

  return (
    <div className=''>
        <div className='flex flex-col bg-white p-3 mt-5 rounded-t-xl shadow-md '>
            {post.imgURL && (
                <div className='h-56 md:h-96 bg-white'>
                    <img src={post.imgURL} alt="" className='h-full w-full object-cover'/>
                </div>
            )}
            <p className='p-2 font-medium'>{post.content}</p>
            <div className='flex justify-start space-x-4 mt-1 p-1 w-100%'>
                {!postLiked ? 
                (
                    <>
                        <HeartIconOutline onClick={likePost}  className='h-6 w-6 cursor-pointer transform hover:scale-110'/>
                        <ChatBubbleOvalLeftIcon className='h-6 w-6' onClick={() => setShowComments(!showComments)} />
                    </>
                ) : 
                (   
                    <>
                        <HeartIconSolid className='h-6 w-6 cursor-pointer text-red-500 transform hover:scale-110'/>
                        <ChatBubbleOvalLeftIcon className='h-6 w-6' onClick={() => setShowComments(!showComments)}/>
                    </>
                )} 
            </div>

            {/* Comment section */}
            { showComments && (
                <>
                    {/* List of existing comments */}
                    <div className='flex flex-col space-y-2'>
                        {post.comments.map((comment) => (
                            <div key={comment._id}>
                            <p>{comment.comment}</p>
                            <p>{comment.authorEmail.username}</p>
                            <p>{formatDate(comment.date)}</p>
                            </div>
                        ))}
                    </div>
                    {/* New comment  */}
                    <div>
                        <form onSubmit={postComment}>
                            <input placeholder="Add comment" className="w-full bg-gray-100 border rounded-md p-1 mt-4 outline-none text-gray-600" type="text" name="comment" id="comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </form>
                    </div>
                </>
            )}

            <div className='flex justify-between '>
                <p className='p-2'>{post.author.username}</p>
                <p className='p-2'>{formatDate(post.posted)}</p>
            </div>
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
