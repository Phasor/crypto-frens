const { 
    fetchPosts,
    createPost,
    getPostById,
    updatePost } = require('../services/postService');
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

exports.get_post_by_id = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        // get user from JWT
        const decodedToken = await verifyJWT(token);
        const userID = decodedToken.sub;
        // console.log(`userID from token: ${userID}`);
        if (userID) {     
            const post = await getPostById(req.params.id, userID);
            if (post.success) {
                return res.json(post);
            } else {return res.status(401).json({ success: false, message: post.message});}
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized'});
        }
    } catch(err) {
        return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
    }
}  

exports.put_update_post_by_id = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const updatedPost = req.body;
    try {
        // get user from JWT
        const decodedToken = await verifyJWT(token);
        const userID = decodedToken.sub;
        // console.log(`userID from token: ${userID}`);
        if (userID) {     
            const post = await updatePost(req.params.id, updatedPost, userID);
            if (post.success) {
                return res.json(post);
            } else {return res.status(401).json({ success: false, message: post.message});}
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized'});
        }
    } catch(err) {
        return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
    }
}
