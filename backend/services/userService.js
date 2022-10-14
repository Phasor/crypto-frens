const User = require('../models/user.js');

exports.createUser = async (user) => {
    try {
        const newUser = await User.create(user);
        // await newUser.save();
        return newUser;
    } catch(err) {
        throw new Error("Error while creating user");
    }
}
