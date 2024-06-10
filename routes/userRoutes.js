const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.post('/logout', userController.logout);

module.exports = router;
