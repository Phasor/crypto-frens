var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// setup middleware
app.use(logger('dev'));
app.use(express.json());  // Instead of using body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // allows our front end application to make HTTP requests to Express application

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
