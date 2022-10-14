const { fetchPosts } = require('../services/postService');
const { createPost } = require('../services/postService');

exports.get_posts = async (req, res) => {
    try {
        const posts = await fetchPosts();
        return res.json({
            success: true,
            posts: posts
        });
    } catch(err) {
        return res.status(500).send(err.message);
    }
}

exports.create_post = async (req, res) => {
    try {
        const post = await createPost(req, res);
        return res.json({
            success: true,
            post: post
        });
    } catch(err) {
        return res.status(500).send(err.message);
    }
}