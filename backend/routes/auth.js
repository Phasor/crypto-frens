const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

router.post('/login', authController.login);
router.get('/google/callback', passport.authenticate('google', {session: false}), authController.googleAuthCallback);
router.get('/google', passport.authenticate('google', {session: false, scope: ['email','profile']}) );

module.exports = router;