const express = require('express');
const router = express.Router();
const controller = require("../controller/groups.controller");


// Create a new group
router.post('/', controller.createGroup);

// Add members to a group
router.post('/:groupId/members', controller.addMember);

// Search for groups
router.get('/search', controller.searchGroup);

// Get all members of a group (visibility to all users)
router.get('/:groupId/members', controller.getAllMembers);

// Delete a group
router.delete('/:groupId', controller.deleteGroup);

// Edit a group by ID (Admin only)
router.put('/:groupId', controller.editGroup);


module.exports = router;
