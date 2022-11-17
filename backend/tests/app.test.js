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

// use to save JWT token below
var token = '';

// clear database
beforeAll(async() => {
    await connectToDB();
})
afterAll(() => {
    mongoose.connection.close()
})

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
                token = response.body.token;
                console.log(token);
            })
    })
})