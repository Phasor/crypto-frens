const { login, googleLogin } = require("../services/authService");
const { verifyJWT, getUserIDFromToken } = require("../lib/utils");

exports.login = async (req, res) => {
    try {
        const user = await login(req.body.username, req.body.password);
        console.log(user);
        if (user.success) {
            res.json({
                success: true,
                token: user.tokenObject.token,
                expiresIn: user.tokenObject.expires,
                user: user.user,
            });
        } else {
            res.status(401).json({ success: false, message: user.message });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: `${error.name}, ${error.message}`,
        });
    }
};

exports.googleAuthCallback = async (req, res) => {
    try {
        // console.log(`req.user: ${req.user}`);
        const user = await googleLogin(req, res);
        if (user.success) {
            res.redirect(
                `${process.env.FRONT_END_BASE_URL}/home?token=${user.tokenObject.token}&firstName=${user.user.firstName}&id=${user.user._id}`
            );
        } else {
            res.redirect(`${process.env.FRONT_END_BASE_URL}/login/failed`);
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: `${err.name}, ${err.message}` });
    }
};
