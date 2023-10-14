const express = require('express');
const router = express.Router();
const controller = require("../controller/messages.controller")

// Send a message in a group
router.post('/', controller.sendMessage);

// Like a message
router.post('/:id/like', controller.likeMessage);

// Edit a message by ID (Message creator only)
router.put('/:messageId', controller.editMessage);

// fetch all messages from a group
router.get('/:group', controller.fetchGrpMsg);
  

module.exports = router;
