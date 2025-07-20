const express = require('express');
const createUser = require('../controllers/Admin/CreateUser');
const getAllUser = require('../controllers/Admin/getAllUsers');
const deleteUser = require('../controllers/Admin/deleteUser');
const editUser = require('../controllers/Admin/editUser');


const router = express.Router();
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


module.exports = router;