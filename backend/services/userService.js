const User = require('../models/user.js');
const utils = require('../lib/utils.js');

exports.createUser = async (user) => {
    try {
        // const newUser = await User.create(user);
        //  return newUser;

        // create and save new user account
        const saltHash = utils.genPassword(user.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
        ...user,
        salt: salt,
        hash: hash
        });

        const response = await newUser.save();
        // issue user with JWT
        const jwt = utils.issueJWT(response);
        return { success: true, user:user, token: jwt.token, expiresIn: jwt.expires };
     } catch (err) {
        return { success: false, message: `${err.name}, ${err.message}`};
     }
}
