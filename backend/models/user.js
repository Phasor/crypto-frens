const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema  = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    shortName: { type: String, required: true },
    username: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    birthDay: { type: Date, required: false },
    profileImage: { type: String, data: Buffer, required: false },
    pendingFriendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    pendingFriendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
})

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function() { // We don't use an arrow function as we'll need the this object
    return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);