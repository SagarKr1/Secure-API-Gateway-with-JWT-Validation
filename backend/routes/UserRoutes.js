const express = require('express');
const login = require('../auth/User/login');
const verifyEmail = require('../auth/User/EmailVerification');



const router = express.Router();


router.get('/', async (req, res) => {
    res.json({
        status: true,
        message: "Hello from user router"
    })
});

router.post('/login',login.login);
router.get('/verify/:token',verifyEmail.verifyEmail);
module.exports = router; 