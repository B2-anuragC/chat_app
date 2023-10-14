const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require("mongoose");

async function createGroup(req, res) {
  const { _id= (new mongoose.Types.ObjectId()),name } = req.body;

  try {
    // Check if a group with the same name already exists
    const existingGroup = await Group.findOne({ name });

    if (existingGroup) {
      return res.status(400).json({ message: 'A group with this name already exists' });
    }

    // Create a new group
    const group = new Group({ _id, name });

    // Save the group to the database
    await group.save();

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addMember(req, res) {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find users by their IDs
    const users = await User.find({ _id: { $in: userIds } });
    if (!users || users.length !== userIds.length) {
      return res.status(400).json({ message: "One or more users not found" });
    }

    // Add users to the group
    group.members.push(...userIds);
    await group.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function searchGroup(req, res) {
  try {
    const { query } = req.query;

    // Find groups that match the search query
    const groups = await Group.find({ name: { $regex: query, $options: "i" } });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllMembers(req, res) {
  try {
    const { groupId } = req.params;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Get the list of members
    const members = await User.find(
      { _id: { $in: group.members } },
      { _id: 1, username: 1 }
    );
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteGroup(req, res) {
  try {
    const { groupId } = req.params;

    // Find and delete the group by ID
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function editGroup(req, res) {
  try {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { groupId } = req.params;
    const { name, description, members } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Update group properties
    group.name = name;
    group.description = description;
    group.members = members;

    await group.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
    createGroup,
    addMember,
    searchGroup,
    getAllMembers,
    deleteGroup,
    editGroup
}