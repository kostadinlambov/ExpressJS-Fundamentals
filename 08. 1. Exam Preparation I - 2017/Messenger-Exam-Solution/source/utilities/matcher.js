
const isLink = /^(?:http|https)[^ ]*$/;

module.exports = {
    isMessageLink: (message) => {
        return message.match(isLink);
    },
    isLinkAnImage: (link) => {
        return link.endsWith('jpg') || link.endsWith('jpeg') || link.endsWith('png');
    }
};