const Message = require('../models/Message');

function toggleMessageLike(req, res, mode) {
    let messageId = req.params.messageId;

    Message.findById(messageId).then(message => {
        if (!message) {
            return res.redirect('/?error=Message no longer exists');
        }

        if (mode === 'like') {
            message.isLiked = true;
            message.likedUser = req.user._id;
        } else {
            if (message.isLiked && message.likedUser.equals(req.user._id)) {
                message.isLiked = false;
                message.likedUser = null;
            }
        }
        message.save()
            .then(() => res.redirect('back'));
    });
}

module.exports = {
    like: {
        get: (req, res) => {
            toggleMessageLike(req, res, 'like');
        }
    },
    dislike: {
        get: (req, res) => {
            toggleMessageLike(req, res, 'dislike');
        }
    }
};