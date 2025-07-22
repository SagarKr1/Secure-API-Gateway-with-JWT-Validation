const express = require('express');
const login = require('../auth/User/login');
const verifyEmail = require('../auth/User/EmailVerification');
const userBlog = require('../controllers/User/createBlog');
const getAllApprovedBlog = require('../controllers/User/getAllBlogs');
const getUserBlog = require('../controllers/User/getUserBlog');
const editBlog = require('../controllers/User/edit_blog');

const router = express.Router();


router.get('/', async (req, res) => {
    res.json({
        status: true,
        message: "Hello from user router"
    })
});

router.post('/create_blog',userBlog.createBlogUser)

router.get('/user_blog/:creator_id',getUserBlog.getBlogsByCreator);
router.get('/approved_blog',getAllApprovedBlog.getApprovedBlogs);
router.get('/unapproved_blog',getAllApprovedBlog.getUnapprovedBlogs);
// router.put('/edit_blog',editBlog.editBlogByUser);

router.get('/latest_blog',getAllApprovedBlog.getLatestBlog);
router.post('/login',login.login);
router.get('/verify/:token',verifyEmail.verifyEmail);
module.exports = router; 