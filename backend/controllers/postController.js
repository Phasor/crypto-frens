const { fetchPosts } = require('../services/postService');
const { createPost } = require('../services/postService');
const { verifyJWT } = require('../lib/utils');

exports.get_posts = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        // get user from JWT
        const decodedToken = await verifyJWT(token);
        const userID = decodedToken.sub;
        if (userID) {     
            const posts = await fetchPosts(userID);
            return res.json({
                success: true,
                posts: posts
            });
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized'});
        }
    } catch(err) {
        return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
    }
}

exports.create_post = async (req, res) => {
    // check if decoded token belongs to the user, create post if so, else reject request
    const token = req.headers.authorization.split(' ')[1];
    try{
        const decodedToken = await verifyJWT(token);
        if (decodedToken.sub === req.body.author) { // user is authorised
            const post = await createPost(req, res);
            return res.json({ success: true, post: post });
        } else {
            return res.status(401).send('You are not authorized to create a post as this author.');
        }
    } catch(err) {
        return res.status(500).send(err.message);
    }
}
        