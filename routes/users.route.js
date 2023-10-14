const express = require('express');
const router = express.Router();
const controller = require("../controller/users.controller");

// create new user by admin only
router.post('/add', controller.createUser);

// edit user by admin or created user only
router.put('/:id', controller.updateUser);

// fetch users list by admin only
router.get('/all', controller.fetchAllUsers);

// delete user by admin only
router.delete('/:userId', controller.deleteUser);

// search users by name
router.get('/search', controller.searchUsers);


module.exports = router;
