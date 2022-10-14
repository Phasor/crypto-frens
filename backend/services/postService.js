const Post = require('../models/post');

exports.fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        return posts;
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