const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const JwtStrategy = require('passport-jwt').Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, (payload, done) => {
    
    // this is our verify callback function our protected routes will call
    // // req payload contains "sub" property which is the id of the user in the db
    User.findOne({ _id: payload.sub })
        .then(user => {
            console.log('user', user);
            // if we reach here our jwt is valid, now just check we have a  user from the db
            if (user) {
                return done(null, user); // no error, but there is a user
            } else {
                return done(null, false); // no error, no user
            }
        })
        .catch(err => done(err, null));
});

const fbStrategy = new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
    passReqToCallback: true,
  },
  function(req, accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
);

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

    const user = {
        googleId: profile.id,
        name: profile.displayName,

    }
    User.findOrCreate({ googleId: profile.id, profileImage: profile.photos[0] }, function (err, user) {
      return cb(err, user);
    });
  }
);


// passport object being provided by app.js
module.exports = (passport) => {
    passport.use(strategy);
    passport.use(fbStrategy);
    passport.use(googleStrategy);
}