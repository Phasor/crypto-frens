var express = require('express');
var router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// open route
router.post('/signup', userController.post_signup);

// protected routes
router.get('/all', passport.authenticate('jwt', {session: false}), userController.get_all_users);
router.get('/:id', passport.authenticate('jwt', {session: false}), userController.get_by_id);
router.put('/:id', passport.authenticate('jwt', {session: false}), userController.put_update_user);
router.post('/:id/friend-request', passport.authenticate('jwt', {session: false}), userController.post_friend_request);
router.post('/:id/friend-request/accept', passport.authenticate('jwt', {session: false}), userController.post_friend_request_accept);

module.exports = router;
