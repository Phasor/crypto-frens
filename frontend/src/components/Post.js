import React, { useState, useEffect } from 'react';
import formatDate from '../utils/formatDate';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import ImageModal from './ImageModal';

export default function Post({setPosts, post}) {
    const [comment, setComment] = useState('');
    const [postLiked, setPostLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkIfLiked = () => {
            if(localStorage.getItem('userID')) {
                if(post.likes.includes(localStorage.getItem('userID'))){
                    setPostLiked(true);
                }
            }
        }
        checkIfLiked();
    }, [postLiked, post.likes]);

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
            // console.log(data);
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
                setPostLiked(true);
            }
        }catch(err){
            console.log(err);
        }
    }

    const unlikePost = async (e) => {
        try{
            const response = await fetch(`http://localhost:3000/api/v1/post/${post._id}/unlike`,
                {method: 'POST',
                headers: {'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`},
            });
            const data = await response.json();
            if(data.success){
                // refresh the posts to show the new unlike
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
                setPostLiked(false);
            }
        }catch(err){
            console.log(err);
        }
    }


  return (
    <div data-test="post"  className="" >
        {/* image model popup */}
        {
            showModal && <ImageModal postURL={post.imgURL} setShowModal={setShowModal} showModal={showModal}/>
        }
        <div className='flex flex-col bg-white p-3 mt-5 rounded-t-xl shadow-md'>
            {post.imgURL && !showModal && (
                <div className='h-56 md:h-96 bg-white'>
                    <img src={post.imgURL} alt="" className='h-full w-full object-cover max-h-96 cursor-pointer' onClick={() => setShowModal(!showModal)}/>                
                </div>
            )}
            <p className='p-2 py-4 font-medium border-b'>{post.content}</p>
            <div className='flex justify-start space-x-4 mt-1 p-1 w-100%'>
                {!postLiked ? 
                (
                    <>
                        <HeartIconOutline onClick={likePost}  className='h-6 w-6 cursor-pointer transform hover:scale-110'/>
                        <ChatBubbleOvalLeftIcon className='h-6 w-6 transform hover:scale-110' onClick={() => setShowComments(!showComments)} />
                    </>
                ) : 
                (   
                    <>
                        <HeartIconSolid onClick={unlikePost} className='h-6 w-6 cursor-pointer text-red-500 transform hover:scale-110'/>
                        <ChatBubbleOvalLeftIcon className='h-6 w-6 transform hover:scale-110' onClick={() => setShowComments(!showComments)}/>
                    </>
                )} 
            </div>
            <div className='flex'>
                <p className='pl-2 text-sm'>Likes: {post.likes.length}</p>
                <p className='pl-2 text-sm'> Comments: {post.comments.length}</p>
            </div>

            {/* Comment section */}
            { showComments && (
                <>
                    {/* List of existing comments */}
                    <div className='flex flex-col space-y-2'>
                        {post.comments.map((comment) => (
                            <div className='flex flex-col p-2 border-b border-gray-100' key={comment._id}>
                            <p className='text-sm'>{comment.authorEmail.username}</p>
                            <p className='font-medium '>{comment.comment}</p>
                            <p className='text-sm'>{formatDate(comment.date)}</p>
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
  )
}
