//Import express
const express = require('express');
const router = express.Router();

//Import user controller
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Export router in an other road
module.exports = router;