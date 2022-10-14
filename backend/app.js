var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

var app = express();
const baseURL = '/api/v1';

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// setup middleware
app.use(logger('dev'));
app.use(express.json());  // Instead of using body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // allows our front end application to make HTTP requests to Express application

// apply routes
app.use(`${baseURL}/user`, userRouter);
app.use(`${baseURL}/post`, postRouter);

module.exports = app;
