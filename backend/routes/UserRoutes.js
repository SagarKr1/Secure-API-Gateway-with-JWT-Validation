const express = require('express');
const login = require('../auth/User/login');
const verifyEmail = require('../auth/User/EmailVerification');
const userBlog = require('../controllers/User/createBlog');
const getAllApprovedBlog = require('../controllers/User/getAllBlogs');
const getUserBlog = require('../controllers/User/getUserBlog');
const forgotPassword = require('../auth/User/forgotPass');


const router = express.Router();
// auth
const authMiddleware = require('../auth/authToken/authToken');

router.get('/', async (req, res) => {
    res.json({
        status: true,
        message: "Hello from user router"
    })
});
// user create blog
router.post('/create_blog',authMiddleware(['user']),userBlog.createBlogUser)

// user get blog
router.get('/user_blog/:creator_id',getUserBlog.getBlogsByCreator);

// get blogs approved and unapproved
router.get('/approved_blog',getAllApprovedBlog.getApprovedBlogs);
router.get('/unapproved_blog',getAllApprovedBlog.getUnapprovedBlogs);

//forgot password
router.put('/forgot_password',forgotPassword.forgotPassword);

// latest blogs
router.get('/latest_blog',getAllApprovedBlog.getLatestBlog);

// login
router.post('/login',login.login);

// verify new user 
router.get('/verify/:token',verifyEmail.verifyEmail);

module.exports = router; 