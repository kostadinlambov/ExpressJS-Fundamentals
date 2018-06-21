const homeController = require('./home');
const userController = require('./user');
const threadController = require('./thread');
const messageController = require('./message');

module.exports = {
    user: userController,
    home: homeController,
    thread: threadController,
    message: messageController
};