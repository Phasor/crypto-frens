const User = require('../models/user.js');
const utils = require('../lib/utils.js');
const mongoose = require('mongoose');

exports.createUser = async (user) => {
    try {
        // create and save new user account
        const saltHash = utils.genPassword(user.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
        ...user,
        salt: salt,
        hash: hash
        });

        const response = await newUser.save();
        // issue user with JWT
        const jwt = utils.issueJWT(response);
        return { success: true, user:user, token: jwt.token, expiresIn: jwt.expires };
     } catch (err) {
        return { success: false, message: `${err.name}, ${err.message}`};
     }
}

exports.getUserById = async (id) => {
    try{
        const user = await User.findById(id);
        return user;
    } catch(err){
        return err;
    }
}

exports.UpdateUser = async (userID, updatedUserDetails, token) => {
    // verify user has the right JWT
    const decodedToken = await utils.verifyJWT(token);
    console.log(`decodedToken: ${decodedToken}`);
    // console.log(`userID: ${userID}`);
    console.log(`decodedToken.sub: ${decodedToken.sub}`);
    if(decodedToken.sub === userID){
        try{
            const user = await User.findByIdAndUpdate(userID, updatedUserDetails, {new: true});
            return user;
        } catch(err){
            return err;
        }
    } else {
        return {success: false, message: "You are not authorized to update this user"};
    }
}

exports.sendFriendRequest = async (userID, friendID) => {
    try{
        const user = await User.findById(userID);
        const friend = await User.findById(friendID);
        if(user && friend){
            user.pendingFriendRequestsSent.push(friendID);
            friend.pendingFriendRequestsReceived.push(userID);
            const updatedFriend = await friend.save();
            const updatedUser = await user.save();
            return {success: true, user: updatedUser, friend: updatedFriend};
        } else {
            return {success: false, message: "User or friend not found"};
        }
    } catch(error){
        return error;
    }
}

exports.acceptFriendRequest = async (userID, friendID) => {
    try{
        const userObjID = mongoose.Types.ObjectId(userID);
        // console.log(`userObjID: ${userObjID}`);
        const friendObjID = mongoose.Types.ObjectId(friendID);
        console.log(`friendObjID: ${friendObjID}`);
        const user = await User.findById(userObjID);
        const friend = await User.findById(friendObjID);
        if (user && friend){
            // remove request from both send/receive request arrays
            await User.updateOne({_id:userObjID},{$pull: {pendingFriendRequestsReceived : friendObjID }});
            await User.updateOne({_id:friendObjID}, {$pull: {pendingFriendRequestsSent: userObjID}});

            // add friends to both users' friends list
            await user.update({$push: {friends: friendObjID}});
            await friend.update({$push: {friends: userObjID}});
            return {success: true, user: user, friend: friend};
        } else {
            return {success: false, message: "one or both users not found"};
        }
    } catch(err){
        return err;
    }
}
