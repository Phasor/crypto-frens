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

exports.googleLogin = async (req, res) => {
    try{
         // valid user, issue a JWT
         const tokenObject = utils.issueJWT(req.user);
         // console.log('tokenObject', tokenObject);
         //const ID = utils.getUserIDFromToken(tokenObject.token);
         //console.log('ID', ID);
         return {success: true, tokenObject: tokenObject, user: req.user};
    }catch(err){
        console.log(err);
        return {success: false, message: `${err.name}, ${err.message}`};
    }
}
