const { 
    fetchPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    createComment,
    likePost,
    fetchAllUserPosts,
    unlikePost } = require('../services/postService');
const { verifyJWT, getUserIDFromToken } = require('../lib/utils');
const {body, validationResult} = require('express-validator');

exports.get_posts = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        // get user from JWT
        const userID = getUserIDFromToken(token);
        if (userID) {     
            const posts = await fetchPosts(userID);
            // console.log(`posts: ${posts}`);
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

// exports.create_post = async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     const userID = getUserIDFromToken(token);
//     console.log(`userID from token: ${userID}`);
//     try{
//         const post = await createPost(userID, req.body);
//         return res.json({ success: true, post: post });
//     } catch(err) {
//         return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
//     }
// }


exports.create_post = [
    // validate and sanitize fields
    body('content', 'Post content must not be empty.').trim().isLength({ min: 1 }).escape(),

    // process request after validation and sanitization
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // there are input errors
            res.status(400).json({ success: false, message: errors.array() });
            return;
        } else {
            // data from form is valid
            const token = req.headers.authorization.split(' ')[1];
            const userID = getUserIDFromToken(token);
            // console.log(`userID from token: ${userID}`);
            try{
                const post = await createPost(userID, req.body);
                return res.json({ success: true, post: post });
            } catch(err) {
                return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
            }
        }
    }
]

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

exports.delete_post_by_id = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        // get user from JWT
        const decodedToken = await verifyJWT(token);
        const userID = decodedToken.sub;
        // console.log(`userID from token: ${userID}`);
        if (userID) {     
            const post = await deletePost(req.params.id, userID);
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

exports.post_create_comment = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = getUserIDFromToken(token);
    try{
        const post = await createComment(req.params.id, req.body, userID);
        if(post.success) {
            return res.json({success: true, post: post.post});
        } else{
            return res.status(401).json({success: false, message: post.message});
        }
    }catch(err){
        return res.status(500).json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.post_like = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = getUserIDFromToken(token);
    try{
        const post = await likePost(req.params.id, userID);
        if(post.success) {
            return res.json({success: true, post: post.post});
        } else {
            return res.status(401).json({success: false, message: post.message});
        }
    } catch(err){
        return res.status(500).json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.post_unlike = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = getUserIDFromToken(token);
    try{
        const post = await unlikePost(req.params.id, userID);
        if(post.success) {
            return res.json({success: true, post: post.post});
        } else {
            return res.status(401).json({success: false, message: post.message});
        }
    } catch(err){
        return res.status(500).json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_post_by_user_id = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = getUserIDFromToken(token);
    if(userID == req.params.id) {
        try {
            const posts = await fetchAllUserPosts(userID);
            return res.json({success: true, posts: posts});
        } catch(err) {
            return res.status(500).json({ success: false, message: `${err.name}, ${err.message}` });
        }
    } else {
        return res.status(401).json({success: false, message: 'Unauthorized'});
    }
}