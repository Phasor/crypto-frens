var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// open route
router.post('/signup', userController.post_signup);

module.exports = router;
