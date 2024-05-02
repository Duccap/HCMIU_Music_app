const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
// Handle GET request
router.get('/', userController.renderHomepage);
router.get('/login', userController.renderLogin);
router.post('/login', userController.loginHandler);

module.exports = router;