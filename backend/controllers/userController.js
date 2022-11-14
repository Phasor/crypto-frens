const { 
    createUser, 
    getUserById, 
    UpdateUser, 
    sendFriendRequest,
    acceptFriendRequest,
    getAllUsers,
    getPendingFriendsReceived,
    getPendingFriendsSent,
    getFriends,
    removeFriend,
    getAllUsersExFriends } = require("../services/userService");

const { verifyJWT, getUserIDFromToken } = require('../lib/utils');
const { body, validationResult } = require('express-validator');

// exports.post_signup = async (req, res) => {
//     try{
//         const user = await createUser(req.body);
//         // console.log(`req.body received from client: ${req.body}`);
//         return res.json({
//             success: true,
//             user: user
//         });
//     } catch(err) {
//         return res.json({success:false, message: `${err.name}, ${err.message}`});
//     }
// }


exports.post_signup = [
    // validate and sanitize fields
    body('username', 'Email must be specified.').trim().isLength({ min: 1 }).isEmail().withMessage("Email is not valid.").escape(),
    body('firstName', 'First name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('lastName', 'Last name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password must not be empty.').trim().isAlphanumeric().isLength({ min: 4 }).withMessage("Password must be at least 4 characters long.").escape(),

    // process request after validation and sanitization
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // there are input errors
            return res.json({success:false, errors: errors.array()});
        } else {
            try{
                const user = await createUser(req.body);
                // console.log(`req.body received from client: ${req.body}`);
                return res.json({
                    success: true,
                    user: user
                });
            } catch(err) {
                return res.json({success:false, message: `${err.name}, ${err.message}`});
            }
        }
    }
]

exports.get_by_id = async (req, res) => {
    try{
        const user = await getUserById(req.params.id);
        if(user){
            return res.json({
                success: true,
                user: user
            });
        } else {
            return res.status(404).json({success: false, message: "User not found"});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.put_update_user = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const user = await UpdateUser(req.params.id, req.body, token);
        if(user){
            return res.json({success: true, user: user});
        } else {
            return res.status(401).json({success: false, message: "Unauthorised"});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.post_friend_request = async (req, res) => {
    try{
        const response = await sendFriendRequest(req.params.id, req.body.friendID);
        if(response.success){
            return res.json({success: true, user: response.user, friend: response.friend});
        } else {
            return res.json({success: false, message: response.message});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.post_friend_request_accept = async (req, res) => {
    try{
        const response = await acceptFriendRequest(req.params.id, req.body.friendID);
        if(response.success){
            return res.json({success: true, user: response.user, friend: response.friend});
        } else {
            return res.json({success: false, message: response.message});
        }
    }catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_all_users = async (req, res) => {
    try{
        const users = await getAllUsers();
        return res.json({success: true, users: users});
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_pending_friends_recieved = async (req, res) => {
    try{
        const pendingFriends = await getPendingFriendsReceived(req.params.id);
        return res.json({success: true, pendingFriends: pendingFriends});
    }catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_pending_friends_sent = async (req, res) => {
    try{
        const pendingFriends = await getPendingFriendsSent(req.params.id);
        return res.json({success: true, pendingFriends: pendingFriends});
    }catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_friends = async (req, res) => {
    try{
        const friends = await getFriends(req.params.id);
        return res.json({success: true, friends: friends});
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.delete_friend = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserIDFromToken(token);
        if(userFromToken === req.params.id){ // check if the user is the same as the one in the token
            const response = await removeFriend(req.params.id, req.body.friendID);
            if(response.success){
                return res.json({success: true, user: response.user, friend: response.friend});
            } else {
                return res.json({success: false, message: response.message});
            }
        } else {
            return res.status(401).json({success: false, message: "Unauthorised"});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_all_users_ex_friends = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const userID = getUserIDFromToken(token);
        const users = await getAllUsersExFriends(userID);
        return res.json({success: true, users: users});
    }catch(err){
        res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

