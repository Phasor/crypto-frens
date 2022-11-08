const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.fetchPosts = async (userID) => {
    // fetch posts of users friends and the user himself
    try {
        // get friends posts
        const friends = await User.findById(userID).select('friends');
        const allPosts = [];
        for (let i = 0; i < friends.friends.length; i++) { // for each friend
            // get each friends' posts
            const posts = await Post.find({ author: friends.friends[i] }).populate('author', 'username');
            // add each friends' posts to allPosts
            allPosts.push(...posts);
        } // end of for loop

        // users posts
        const userPosts = await Post.find({ author: userID }).populate('author', 'username');
         allPosts.push(...userPosts);
        // sort posts by date
        allPosts.sort((a, b) => b.posted - a.posted);
        return allPosts;
    } catch(err) {
        return res.status(500).send(err.message);
    }
}

exports.createPost = async (userID, post) => {
    try {
        const newPost = await Post.create({
            title: post.title,
            content: post.content,
            author: userID,
            imgURL: post.imgURL,
        });
        return newPost;
    } catch(err) {
        return err;
    }
}

exports.getPostById = async (postID, userID) => {
    try {
        // test to see if user if allowed to see this post
        const postToView = await Post.findById(postID);
        const author = postToView.author;
        const friends = await User.findById(userID).select('friends');
        if (friends.friends.includes(author)) {
            const post = await Post.findById(postID).populate('author', 'username');
            return {success: true, post:post};
        } else {
            return {success: false, message:'You are not authorized to view this post.'};
        }
    } catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.updatePost = async (postID, updatedPost, userID) => {
    try {
        // test to see if user if allowed to change this post
        const postToChange = await Post.findById(postID);
        const author = postToChange.author;
        // console.log(`author: ${author}`);
        // console.log(`userID: ${userID}`);
        if(author == userID) {
            const post = await Post.findByIdAndUpdate(postID, updatedPost, {new: true});
            return {success: true, post:post};
        }
        else{
            return {success: false, message:'You are not authorized to change this post.'};
        }
    } catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.deletePost = async (postID, userID) => {
    try {
        // test to see if user if allowed to change this post
        const postToDelete = await Post.findById(postID);
        const author = postToDelete.author;
        // console.log(`author: ${author}`);
        // console.log(`userID: ${userID}`);
        if(author == userID) {
            const post = await Post.findByIdAndDelete(postID);
            return {success: true, post:post};
        }
        else{
            return {success: false, message:'You are not authorized to change this post.'};
        }
    } catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.createComment = async (postID, payload, userID) => { 
    var authorEmail = '';
    try{
        authorEmail = await User.findById(userID).select('username');
    }catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }

    const CommentToPost = {
        comment: payload.comment,
        author: userID,
        authorEmail: authorEmail,
        date: payload.date
    }

    try{
        const post = await Post.findByIdAndUpdate(postID, {$push: {comments: CommentToPost}}, {new: true});
        return {success: true, post: post};
    }catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.likePost = async (postID, userID) => {
    try{
        const currentLikes = await Post.findById(postID).select('likes');
        if(currentLikes.likes.includes(userID)){
            return {success: false, message:'You already liked this post.'};
        }
        const post = await Post.findByIdAndUpdate(postID, {$push: {likes: userID}}, {new: true});
        return {success: true, post: post};
    }catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.unlikePost = async (postID, userID) => {
    try{
        // check if post is like by user
        const post = await Post.findById(postID).select('likes');
        if(!post.likes.includes(userID)){
            return {success: false, message:'You have not liked this post.'};
        } else{
            const updatedPost = await Post.findByIdAndUpdate(postID, {$pull: {likes: userID}}, {new: true});
            return {success: true, post: updatedPost};
        }
    }catch(err){
        return {success: false, message:`${err.name}, ${err.message}`};
    }
}

exports.fetchAllUserPosts = async (userID) => {
    try{
        const posts = await Post.find({author: userID}).populate('author', 'username');
        return posts;
    }catch(err){
        return err;
    }
}
