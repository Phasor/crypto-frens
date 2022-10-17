var express = require('express');
var router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// open route
router.post('/signup', userController.post_signup);
router.get('/:id', passport.authenticate('jwt', {session: false}), userController.get_by_id);
router.put('/:id', passport.authenticate('jwt', {session: false}), userController.put_update_user);

module.exports = router;
