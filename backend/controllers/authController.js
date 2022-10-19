const { login } = require('../services/authService');

exports.login = async (req, res) => {
    try{
        const user = await login(req.body.username, req.body.password);
        // console.log(user);
        if(user.success){
            res.json({success: true, token: user.tokenObject.token, expiresIn: user.tokenObject.expires});
        }
        else{
            res.status(401).json({success: false, message: user.message});
        }
      
    }catch(error){
        console.log(error);
        res.json({success: false, message: `${error.name}, ${error.message}`});
    }
}

