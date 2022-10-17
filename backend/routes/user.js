var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// open route
router.post('/signup', userController.post_signup);
router.get('/:id', userController.get_by_id);


module.exports = router;
