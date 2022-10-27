const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema  = new Schema({
    firstName: { type: String, required: true, default: 'default' },
    lastName: { type: String, required: true, default: 'default' },
    shortName: { type: String, required: true, default: 'default' },
    username: { type: String, required: true, default: 'default' },
    hash: { type: String, required: true, default: 'default' },
    salt: { type: String, required: true, default: 'default' },
    joinDate: { type: Date, default: Date.now },
    birthDay: { type: Date, required: false},
    profileImage: { type: String, data: Buffer, required: false },
    pendingFriendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    pendingFriendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    facebookId: { type: String, required: false },
    googleId: { type: String, required: false },
})

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function() { // We don't use an arrow function as we'll need the this object
    return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);