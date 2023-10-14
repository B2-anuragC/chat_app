const express = require('express');
const router = express.Router();
const jwtMiddleware = require("../middleware/jwt.middleware");

const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const groupsRoute = require('./groups.route');
const messagesRoute = require('./messages.route');


// non authentication required apis
router.use("/auth", authRoute);

router.use(jwtMiddleware);
router.use('/users', usersRoute);
router.use('/groups', groupsRoute);
router.use('/messages', messagesRoute);


module.exports = router;