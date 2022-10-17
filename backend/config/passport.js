const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const JwtStrategy = require('passport-jwt').Strategy
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

// passport object being provided by app.js
module.exports = (passport) => {
    passport.use(strategy);
}