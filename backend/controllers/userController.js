const { createUser, getUserById, UpdateUser } = require("../services/userService");

exports.post_signup = async (req, res) => {
    try{
        const user = await createUser(req.body);
        console.log(req.body);
        return res.json({
            success: true,
            user: user
        });
    } catch(err) {
        return res.json({success:false, message: `${err.name}, ${err.message}`});
    }
}

exports.get_by_id = async (req, res) => {
    try{
        const user = await getUserById(req.params.id);
        if(user){
            return res.json({
                success: true,
                user: user
            });
        } else {
            return res.status(404).json({success: false, message: "User not found"});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}

exports.put_update_user = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const user = await UpdateUser(req.params.id, req.body, token);
        if(user){
            return res.json({success: true, user: user});
        } else {
            return res.status(401).json({success: false, message: "Unauthorised"});
        }
    } catch(err){
        return res.json({success: false, message: `${err.name}, ${err.message}`});
    }
}



