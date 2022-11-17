const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const utils = require('../lib/utils');
require("dotenv").config({ path: "../.env" })
//console.log(process.env.DB_STRING_TEST);

// connect to Mongo db
// dummy data has been uploaded before running these
async function connectToDB(){
    const mongoDB = process.env.DB_STRING_TEST;
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

// create a new user
const createUser = async () => {
    const userPassword = 'test';
    const saltHash = utils.genPassword(userPassword);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    const userPayload = 
    {
        firstName: 'David',
        lastName: 'Smith',
        shortName: 'dsmith',
        username: 'a@test.com',
        hash: hash,
        salt: salt
    }
    // const testUser = new User(userPayload);
    
    const newUser = await User.create(userPayload, (err, user) => {
        if (err) {
            console.log(err);
        }
        console.log(`user created: ${user}`);
        return user;
    });

    return newUser;
}

// create some dummy posts 
const postPayload = [
    {
        content: 'Post 1 content',
        author: mongoose.Types.ObjectId('5f9e1b1b1b1b1b1b1b1b1b1b'),
    },
    {
        content: 'Post 2 content',
        author: mongoose.Types.ObjectId('5f9e1b1b1b1b1b1b1b1b1b1b'),
    }
];

const createPosts = async (posts) => {
    const newPosts = await Post.create(posts, (err, posts) => {
        if (err) {
            console.log(err);
        }
        return newPosts;
    });
}


const populateDB = async () => {
    await connectToDB();
    const user = await createUser();
    console.log(`user: ${user}`);
    await createPosts(postPayload);
}

populateDB();
mongoose.connection.close()
process.exit();