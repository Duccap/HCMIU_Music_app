const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
// Handle GET request
router.get('/', userController.renderHomepage);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

module.exports = router;