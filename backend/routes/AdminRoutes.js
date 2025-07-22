const express = require('express');
const createUser = require('../controllers/Admin/CreateUser');
const getAllUser = require('../controllers/Admin/getAllUsers');
const deleteUser = require('../controllers/Admin/deleteUser');
const editUser = require('../controllers/Admin/editUser');
const adminBlog = require('../controllers/Admin/createBlog');
const getBlog = require('../controllers/Admin/getUserBlog');
const approveBlog = require('../controllers/Admin/approveBlog');
const adminEditBlog = require('../controllers/Admin/edit_blog');
const deleteBlog = require('../controllers/Admin/deleteBlog');
const profile = require('../controllers/Admin/editProfile');

const router = express.Router();

// auth
const authMiddleware = require('../auth/authToken/authToken');

router.get('/',async (req, res) => {
    res.json({
        status: true,
        message: "Hello from admin router"
    })
});

router.post('/create_user',authMiddleware(['admin','subadmin']),createUser.CreateUser);
router.get('/get_all_users',authMiddleware(['admin','subadmin']),getAllUser.getAllUser);

router.put('/edit_user',authMiddleware(['admin','subadmin']),editUser.editUser);
router.delete('/delete_user',authMiddleware(['admin','subadmin']),deleteUser.deleteUser);

router.post('/create_blog',authMiddleware(['admin','subadmin']),adminBlog.createBlogAdmin);
router.put('/edit_blog',authMiddleware(['admin','subadmin','user']),adminEditBlog.editBlog);
router.put('/approve_blog',authMiddleware(['admin','subadmin']),approveBlog.updateBlogApproval);
router.get('/user_blog/:creator_id',authMiddleware(['admin','subadmin']),getBlog.getBlogsByCreator);
router.delete('/delete_blog/:id',authMiddleware(['admin','subadmin','user']),deleteBlog.deleteBlog);
router.put('/profile',authMiddleware(['admin','subadmin','user']),profile.editProfile);
router.put('/change_password',authMiddleware(['admin','subadmin','user']),profile.changePassword);


module.exports = router;