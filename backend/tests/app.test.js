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

describe('User paths', () => {
    
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

    describe("given we signup a new user", () => {
        it("should return the new user details", async () => {
            const response = await request(app)
                .post('/api/v1/user/signup')
                .set('Content-Type','application/json')
                .send({
                    firstName: 'David',
                    lastName: 'Smith',
                    shortName: 'dsmith',
                    username: 'b@test.com',
                    password: 'test'
                })
                .then(response => {
                    expect(200)
                    expect(response.body.user.user.username).toEqual('b@test.com')
                    expect(response.body.user.user.lastName).toEqual('Smith')
                    expect(response.body.user.user.firstName).toEqual('David')
                    User2Token = response.body.user.token;
                    User2ID = response.body.user.user._id;
                    // console.log(`User2Token: ${User2Token}`);
                    // console.log(`User2ID: ${User2ID}`);
                })
        })
    })

})