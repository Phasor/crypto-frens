const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');

// protected routes
router.get('/all', passport.authenticate('jwt', {session: false}), postController.get_posts);
router.post('/create', passport.authenticate('jwt', {session: false}), postController.create_post);

module.exports = router;