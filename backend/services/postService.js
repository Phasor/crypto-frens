const Post = require('../models/post');
const User = require('../models/user');

exports.fetchPosts = async (userID) => {
    // fetch posts of users friends only
    try {
        const friends = await User.findById(userID).select('friends');
        const allPosts = [];
        for (let i = 0; i < friends.friends.length; i++) {
            const posts = await Post.find({ author: friends.friends[i] }).populate('author', 'username');
            allPosts.push(...posts);
        }
        return allPosts;
    } catch(err) {
        return res.status(500).send(err.message);
    }
}

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });
        return post;
    } catch(err) {
        return res.status(500).send(err.message);
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