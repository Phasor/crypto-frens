const { createUser } = require("../services/userService");
const { getUserById } = require("../services/userService");

exports.post_signup = async (req, res) => {
    try{
        const user = await createUser(req.body);
        console.log(req.body);
        return res.json({
            success: true,
            user: user
        });
    } catch(err) {
        return res.status(409).send(err.message);
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
        return res.status(409).json({success: false, message: `${err.name}, ${err.message}`});
    }
}



