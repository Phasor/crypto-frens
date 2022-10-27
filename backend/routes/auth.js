const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

router.post('/login', authController.login);
router.post('/login/failed', (req, res) => {res.status(401).json({success: false, message: 'Login failed'})});
router.get('/facebook', passport.authenticate('facebook', {scope: ['profile']}));
router.get('/facebook/callback', passport.authenticate('facebook', 
  {
    failureRedirect: '/login/failed',
    successRedirect: 'http://localhost:3002/home' // client side redirect
}))
router.get('/google', passport.authenticate('google', {scope: ['profile']}));
router.get('/google/callback', passport.authenticate('google', 
  {
    failureRedirect: '/login/failed',
    successRedirect: 'http://localhost:3002/home' // client side redirect
}))

module.exports = router;