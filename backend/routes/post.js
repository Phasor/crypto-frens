const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/all', postController.get_posts);
router.post('/create', postController.create_post);

module.exports = router;