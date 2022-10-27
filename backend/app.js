var express = require('express');
const cookieSession = require("cookie-session");
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

//import routes
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');

var app = express();
// const baseURL = '/api/v1';
const baseURL = '/api/v1'

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// setup middleware
app.use(logger('dev'));
app.use(express.json());  // Instead of using body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(
    {origin: "http://localhost:3002", credentials: true}
)); // allows our front end application to make HTTP requests to Express application

// ***************************************************************UPDATE KEY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.use(cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 }));

// needed since we used sessions for google and fb auth
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });


// apply routes
app.use(`${baseURL}/user`, userRouter);
app.use(`${baseURL}/post`, postRouter);
app.use(`${baseURL}/auth`, authRouter);

module.exports = app;
