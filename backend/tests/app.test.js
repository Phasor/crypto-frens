const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const utils = require('../lib/utils');

// connect to Mongo db
// dummy data has been uploaded before running these
async function connectToDB(){
    const mongoDB = process.env.DB_STRING_TEST;
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}


// clear database
beforeAll(async() => {
    if(mongoose.connection.readyState === 0){ // not connected
        await connectToDB();
        console.log('New connection to DB established...');
    } else {
        console.log('Already connected to db, not starting a new connection...');
    }

    // clear database
    await User.deleteMany()
    await Post.deleteMany()
    console.log('Database cleared...');
})

afterAll(() => {
    mongoose.connection.close()
    console.log('Database connection closed')
})

// Save user details for later use
var User1Token = '';
var User1ID = '';
var User2Token = '';
var User2ID = '';
var Post1ID = '';

describe('User paths', () => {
    
    describe("given we signup a new user", () => {
        it("should return the new user details", async () => {
            const response = await request(app)
                .post('/api/v1/user/signup')
                .set('Content-Type','application/json')
                .send({
                    firstName: 'David',
                    lastName: 'Smith',
                    shortName: 'dsmith',
                    username: 'a@test.com',
                    password: 'test'
                })
                .then(response => {
                    expect(200)
                    expect(response.body.user.user.username).toEqual('a@test.com')
                    expect(response.body.user.user.lastName).toEqual('Smith')
                    expect(response.body.user.user.firstName).toEqual('David')
                    expect(response.body.user.user.shortName).toEqual('dsmith')
                    User1Token = response.body.user.token;
                    User1ID = response.body.user.user._id;
                    // console.log(`User1Token: ${User1Token}`);
                    // console.log(`User1ID: ${User1ID}`);
                })
        })
    }) // end of test

    describe("given correct login credentials", () => {
        it("should return a 200 status code", async () => {
            const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Content-Type','application/json')
            .send({
                    username: 'a@test.com',
                    password: 'test'
                })
                .expect(200)
                .then(response => {
                    User1Token = response.body.token;
                    User1ID = response.body.user._id;
                    // console.log('User1Token: ' + User1Token);
                    // console.log('User1ID: ' + User1ID);
                })
        })
    })

    describe("given incorrect login credentials", () => {
        it("should return a 401 status code", async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .set('Content-Type','application/json')
                .send({
                    username: 'a@test.com',
                    password: 'wrong'
                })
                .expect(401)
        })
    })

    describe("given we signup another new user", () => {
        it("should return the new user details", async () => {
            const response = await request(app)
                .post('/api/v1/user/signup')
                .set('Content-Type','application/json')
                .send({
                    firstName: 'Ben',
                    lastName: 'Smythe',
                    shortName: 'bSmythe',
                    username: 'b@test.com',
                    password: 'test'
                })
                .then(response => {
                    expect(200)
                    expect(response.body.user.user.username).toEqual('b@test.com')
                    expect(response.body.user.user.lastName).toEqual('Smythe')
                    expect(response.body.user.user.firstName).toEqual('Ben')
                    expect(response.body.user.user.shortName).toEqual('bSmythe')
                    User2Token = response.body.user.token;
                    User2ID = response.body.user.user._id;
                    // console.log(`User2Token: ${User2Token}`);
                    // console.log(`User2ID: ${User2ID}`);
                })
        })
    }) // end of test

    describe("given user 1 sends a friend request to user 2", () => {
        it("friend requests should be reflected in both users", async () => {
            const response = await request(app)
            .post(`/api/v1/user/${User1ID}/friend-request`)
            .set('Content-Type','application/json')
            .set('Authorization', User1Token)
            .send({
                friendID: User2ID
            })
            .then(response => {
                expect(200)
                expect(response.body.user.pendingFriendRequestsSent).toContain(User2ID)
                expect(response.body.friend.pendingFriendRequestsReceived).toContain(User1ID)
            })
        })
    })

    describe("given user 2 accepts user 1's friend request", () => {
        it("the friends list of both users should be updated", async () => {
            const response = await request(app)
            .post(`/api/v1/user/${User2ID}/friend-request/accept`)
            .set('Content-Type','application/json')
            .set('Authorization', User1Token)
            .send({
                friendID: User1ID
            })
            .then(response => {
                expect(200)
                // console.log(`response: ${JSON.stringify(response.body)}`)
                expect(response.body.user.friends).toContain(User1ID)
                expect(response.body.friend.friends).toContain(User2ID)
            })
        })
    })

    describe("given user 1 has 1 friend", () => {
        it("their friends list should contain 1 friend", async () => {
            const response = await request(app)
            .get(`/api/v1/user/${User1ID}/getFriends`)
            .set('Content-Type','application/json')
            .set('Authorization', User1Token)
            .then(response => {
                expect(200)
                expect(response.body.friends.length).toEqual(1)
            })
        })
    })
})

describe('Post paths', () => {
    describe("given user 1 creates a new post", () => {
        it("should return the new post details", async () => {
            const response = await request(app)
                .post('/api/v1/post/create')
                .set('Content-Type','application/json')
                .set('Authorization', User1Token)
                .send({
                    content: 'This is my first post',
                    author: User1ID
                })
                .then(response => {
                    expect(200)
                    Post1ID = response.body.post._id;
                    // console.log(`Post1ID: ${Post1ID}`);
                    expect(response.body.post.content).toEqual('This is my first post')
                    expect(response.body.post.author).toEqual(User1ID)
                })
        })
    }) // end of test

    describe("given user has created 1 post", () => {
        it("their main feed should only contain 1 post", async () => {
            const response = await request(app)
            .get(`/api/v1/post/all`)
            .set('Content-Type','application/json')
            .set('Authorization', User1Token)
            .then(response => {
                expect(200)
                expect(response.body.posts.length).toEqual(1)
            })
        })
    })

    describe("given user 1 likes post 1", () => {
        it("post should have 1 like", async () => {
            const response = await request(app)
                .post(`/api/v1/post/${Post1ID}/like`)
                .set('Content-Type','application/json')
                .set('Authorization', User1Token)
                .then(response => {
                    expect(200)
                    expect(response.body.post.likes).toContain(User1ID)
                })
        })
    })

    describe("given user 1 unlikes post 1", () => {
        it("post should have 0 likes", async () => {
            const response = await request(app)
                .post(`/api/v1/post/${Post1ID}/unlike`)
                .set('Content-Type','application/json')
                .set('Authorization', User1Token)
                .then(response => {
                    expect(200)
                    expect(response.body.post.likes).not.toContain(User1ID)
                })
        })
    })

    describe("given user 2 comments on post 1", () => {
        it("post should have 1 comment from user 2", async () => {
            const response = await request(app)
                .post(`/api/v1/post/${Post1ID}/comment`)
                .set('Content-Type','application/json')
                .set('Authorization', User2Token)
                .send({
                    comment: 'This is a comment',
                    date: Date.now(),
                })
                .then(response => {
                    expect(200)
                    expect(response.body.post.comments[0].author).toEqual(User2ID)
                    expect(response.body.post.comments[0].comment).toEqual('This is a comment')
                    expect(response.body.post.comments.length).toEqual(1)
                })
        })
    })






})






