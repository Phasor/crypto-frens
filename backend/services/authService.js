const User = require('../models/user');
const utils = require('../lib/utils');

exports.login = async (username, password) => {
    try{
        const user = await User.findOne({ username: username})
        if(!user) {
            return {success: false, message: 'Can not find user'};
        }
        // check if supplied password is correct
        const isValid = utils.validPassword(password, user.hash, user.salt);

        if(isValid) {
            // valid user, issue a JWT
            const tokenObject = utils.issueJWT(user);
            // res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
            return {success: true, tokenObject: tokenObject, user: user};
        } else{ // wrong password
            // res.status(401).json({ success: false, message: 'You entered the wrong password' });
            return {success: false, message: 'You entered the wrong password'};
        }
    }catch(error){
        console.log(error);
        return {success: false, message: `${error.name}, ${error.message}`};
    }
}
