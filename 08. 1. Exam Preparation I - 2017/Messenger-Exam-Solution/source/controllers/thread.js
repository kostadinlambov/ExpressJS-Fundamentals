const Thread = require('../models/Thread');
const User = require('../models/User');
const Message = require('../models/Message');
const matcher = require('../utilities/matcher');

module.exports = {
    chatRoom: {
        get: (req, res) => {
            let activeUser = req.user.username;
            let secondUser = req.params.username;

            Thread.findOne({users: {$all: [activeUser, secondUser]}}).then(thread => {
                if (!thread) {
                    return res.redirect('/?error=Thread no longer exists');
                }

                let data = { thread };
                User.findOne({ username: secondUser }).then(user => {
                    if (!user) {
                        return res.redirect('/?error=User no longer exists');
                    }

                    if (user.blockedUsers.indexOf(req.user._id) !== -1) {
                        data.blocked = true;
                    }
                });

                Message.find({ thread: thread._id })
                    .sort({ dateCreated: 1 })
                    .populate('user')
                    .then(messages => {
                        data.messages = messages;
                        if (req.query.error) {
                            data.error = req.query.error;
                        }
                        res.render('thread/chat-room', data);
                    });
            });
        },
        post: (req, res) => {
            let content = req.body.content;

            let activeUser = req.user.username;
            let otherUser = req.params.username;

            Thread.findOne({ users: { $all: [activeUser, otherUser] } }).then(thread => {
                if (!thread) {
                    return res.redirect('/?error=Thread no longer exists');
                }

                let messageData = {
                    thread: thread._id,
                    user: req.user._id,
                    content: content
                };
                if (matcher.isMessageLink(content)) {
                    messageData.isLink = true;
                    if (matcher.isLinkAnImage(content)) {
                        messageData.hasImage = true;
                    }
                }
                Message.create(messageData)
                    .then(message => {
                        if (!message) {
                            return res.redirect(`/thread/${ otherUser }?error=Internal server error. Cannot write to database.`);
                        }

                        res.redirect(`/thread/${ otherUser }`);
                    })
                    .catch(err => {
                        res.redirect(`/thread/${ otherUser }?error=${err.errors.content.message}`);
                    })
            });
        }
    }
};