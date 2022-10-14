const { createUser } = require("../services/userService");

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
