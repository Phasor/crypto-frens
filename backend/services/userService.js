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
            // check if friend is already a friend
            if(user.friends.includes(friendObjID)){
                return {success: false, message: "You are already friends with this user"};
            } else {
                // remove request from both send/receive request arrays
                await User.updateOne({_id:userObjID},{$pull: {pendingFriendRequestsReceived : friendObjID }});
                await User.updateOne({_id:friendObjID}, {$pull: {pendingFriendRequestsSent: userObjID}});

                // add friends to both users' friends list
                await user.update({$push: {friends: friendObjID}});
                await friend.update({$push: {friends: userObjID}});
                return {success: true, user: user, friend: friend};
            }
        } else {
            return {success: false, message: "one or both users not found"};
        }
    } catch(err){
        return err;
    }
}

exports.getAllUsers = async () => {
    try{
        const users = await User.find();
        console.log(`users: ${users}`);
        return users;
    }catch(err){
        return err;
    }
}

exports.getPendingFriendsReceived = async (userID) => {
    try{
        const pendingFriendIDs = await User.findById(userID).select('pendingFriendRequestsReceived');
        const pendingFriends = [];
        for(let i = 0; i < pendingFriendIDs.pendingFriendRequestsReceived.length; i++){
            const pendingFriendDetails = await User.find({_id: pendingFriendIDs.pendingFriendRequestsReceived[i]}).select('firstName lastName username _id');
            pendingFriends.push(pendingFriendDetails[0]);
        }
        return pendingFriends;
    } catch(err){
        return err;
    }
}

exports.getPendingFriendsSent = async (userID) => {
    try{
        const pendingFriendIDs = await User.findById(userID).select('pendingFriendRequestsSent');
        const pendingFriends = [];
        for(let i = 0; i < pendingFriendIDs.pendingFriendRequestsSent.length; i++){
            const pendingFriendDetails = await User.find({_id: pendingFriendIDs.pendingFriendRequestsSent[i]}).select('firstName lastName username _id');
            pendingFriends.push(pendingFriendDetails[0]);
        }
        return pendingFriends;
    } catch(err){
        return err;
    }
}

exports.getFriends = async (userID) => {
    try{
        const friendIDs = await User.findById(userID).select('friends');
        const friends = [];
        for(let i = 0; i < friendIDs.friends.length; i++){
            const friendDetails = await User.find({_id: friendIDs.friends[i]}).select('firstName lastName username _id profileImage');
            friends.push(friendDetails[0]);
        }
        return friends;
    } catch(err){
        return err;
    }
}

exports.removeFriend = async (userID, friendID) => {
    try{
        const userObjID = mongoose.Types.ObjectId(userID);
        const friendObjID = mongoose.Types.ObjectId(friendID);
        const user = await User.findById(userObjID);
        const friend = await User.findById(friendObjID);
        if (user && friend){
            await user.update({$pull: {friends: friendObjID}});
            await friend.update({$pull: {friends: userObjID}});
            return {success: true, user: user, friend: friend};
        } else {
            return {success: false, message: "one or both users not found"};
        }
    }catch(err){
        return err;
    }
}

exports.getAllUsersExFriends = async (userID) => {
    try{
        const user = await User.findById(userID);
        const friends = user.friends;
        const pendingFriendRequestsSent = user.pendingFriendRequestsSent;
        const pendingFriendRequestsReceived = user.pendingFriendRequestsReceived;
        const allUsers = await User.find();
        const allUsersExFriends = allUsers.filter(user => {
            return !friends.includes(user._id) && !pendingFriendRequestsSent.includes(user._id) && !pendingFriendRequestsReceived.includes(user._id) && user._id != userID;
        });
        return allUsersExFriends;
    }catch(err){
        return err;
    }
}
