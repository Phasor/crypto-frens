const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');

// protected routes
router.get('/all', passport.authenticate('jwt', {session: false}), postController.get_posts);
router.get('/:id', passport.authenticate('jwt', {session: false}), postController.get_post_by_id);
router.put('/:id', passport.authenticate('jwt', {session: false}), postController.put_update_post_by_id);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postController.delete_post_by_id);
router.post('/create', passport.authenticate('jwt', {session: false}), postController.create_post);
router.post('/:id/comment', passport.authenticate('jwt', {session: false}), postController.post_create_comment);
router.post('/:id/like', passport.authenticate('jwt', {session: false}), postController.post_like);

module.exports = router;