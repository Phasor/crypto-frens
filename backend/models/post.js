const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    posted: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: Schema.Types.ObjectId, ref: 'User', default:[], required: false}],
    comments:[{type: Object, default:[], required: false}],
    imgURL: {type: String, required: false}
});


// Virtual for user's URL
PostSchema
    .virtual('url')
    .get(function() { // We don't use an arrow function as we'll need the this object
    return `/post/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
