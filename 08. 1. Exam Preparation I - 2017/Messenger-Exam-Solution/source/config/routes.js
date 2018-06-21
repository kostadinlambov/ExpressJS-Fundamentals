const controllers = require('../controllers/index');
const permissions = require('./permissions');

module.exports = (app) => {
    app.get("/", controllers.home.get);

    app.get('/user/register', controllers.user.register.get);
    app.post('/user/register', controllers.user.register.post);

    app.get('/user/login', controllers.user.login.get);
    app.post('/user/login', controllers.user.login.post);

    app.post('/user/logout', controllers.user.logout);

    app.get('/user/find', permissions.hasUserAccess, controllers.user.find.get);

    app.get('/thread/:username', permissions.hasUserAccess ,controllers.thread.chatRoom.get);
    app.post('/thread/:username',
        permissions.hasUserAccess,
        permissions.isNotBlocked,
        controllers.thread.chatRoom.post);

    app.get('/user/:userId/block', permissions.hasUserAccess, controllers.user.block.get);
    app.get('/user/:userId/unblock', permissions.hasUserAccess, controllers.user.unblock.get);

    app.get('/message/:messageId/like', permissions.hasUserAccess, controllers.message.like.get);
    app.get('/message/:messageId/dislike', permissions.hasUserAccess, controllers.message.dislike.get);
};