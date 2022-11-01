const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const JwtStrategy = require('passport-jwt').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy;
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


// // This function is called when the `passport.authenticate()` method is called.
// const googleStrategy = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
//     passReqToCallback: true,
//   },
//   async function(req, accessToken, refreshToken, profile, cb) {

//     //console.log('profile', profile);
//     const user = {
//         googleId: profile.id,
//         profileImage: profile.photos[0].value,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         shortName: profile.displayName,   
//     }
//     // check if user exists in our db
//     const checkUser = await User.findOne({ googleId: profile.id })
//     try{
//         if (checkUser) {
//             req.user = checkUser;
//             // console.log('user exists', checkUser);
//             // callback expects error and user values
//             return cb(null, checkUser);
//         } else {
//             // create new user
//             const newUser = await User.create(user);
//             req.user = newUser;
//             // callback expects error and user values
//             return cb(null, newUser);
//         }
//     } catch(err){
//         console.log('error', err);
//         cb(err);
//     }
//   })

 const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
        passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log('profile', profile);
            // console.log('request.user', request.user);
            const existingUser = await User.findOne({ 'googleId': profile.id });

            // if user exists return the user 
            if (existingUser) {
                console.log('Found existing user...', existingUser);
                return done(null, existingUser);
            }
        // if user does not exist create a new user 
        console.log('Creating new user...');

        const newUser = new User({
            method: 'google',
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            shortName: profile.displayName,  
        });
        await newUser.save();
        return done(null, newUser);
        } catch (error) {
            return done(error, false)
        }
    }
);

// passport object being provided by app.js
module.exports = (passport) => {
    passport.use(strategy);
    // passport.use(fbStrategy);
    passport.use(googleStrategy);
}