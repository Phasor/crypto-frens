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