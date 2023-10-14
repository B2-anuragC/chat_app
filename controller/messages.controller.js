
const Group = require('../models/Group');
const Message = require('../models/Message');



async function sendMessage(req, res) {
    try {
        const { groupId, content } = req.body;

        if(!groupId || !content) return res.status(400).json({ message: 'Invalid message data' });
    
        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
    
        // Create a new message in the group
        const message = new Message({
          groupId,
          content,
          userId: req.user._id,
        });
        await message.save();
    
        res.status(201).json(message);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

async function likeMessage(req, res) {
    try {
        const { id } = req.params;
    
        // Check if the message exists
        const message = await Message.findById(id);
        if (!message) {
          return res.status(404).json({ message: 'Message not found' });
        }
    
        // Check if the user has already liked the message
        if (message.likes.includes(req.user._id)) {
          return res.status(400).json({ message: 'Message already liked by the user' });
        }
    
        // Add the user's ID to the list of users who liked the message
        message.likes.push(req.user._id);
        await message.save();
    
        res.json(message);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

async function editMessage(req, res) {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        
        // Find the message by ID
        const message = await Message.findById(messageId);
        
        if (!message) {
          return res.status(404).json({ message: 'Message not found' });
        }
        
        // Check if the user is the creator of the message (you should implement your own logic for this)
        if (message.creator !== req.user._id) {
          return res.status(403).json({ message: 'Access denied. You are not the message creator.' });
        }
    
        // Update the message text
        message.text = text;
        
        await message.save();
        
        res.json(message);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

async function fetchGrpMsg(req, res){
  const group = req.params.group;

  try {
    // Query the database to find all messages in the specified group
    const messages = await Message.find({ groupId: group });

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this group' });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
    sendMessage,
    likeMessage,
    editMessage,
    fetchGrpMsg
}