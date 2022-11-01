const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

router.post('/login', authController.login);
router.get('/login/failed', (req, res) => {res.status(401).json({success: false, message: 'Login failed'})});
router.get('/login/success', (req, res) => {
    if(req.user){
        res.status(200).json({success: true, message: 'Login successful', user: req.user, cookies: req.cookies})
    } else {
        res.json({success: false, message: 'Login failed'})
    }

});
// router.get('/facebook', passport.authenticate('facebook', {scope: ['profile']}));
// router.get('/facebook/callback', passport.authenticate('facebook', 
//   {
//     failureRedirect: '/login/failed',
//     successRedirect: 'http://localhost:3002/home' // client side redirect
// }));


router.get('/google/callback', passport.authenticate('google', {session: false}), authController.googleAuthCallback);
router.get('/google', passport.authenticate('google', {session: false, scope: ['email','profile']}) );


module.exports = router;