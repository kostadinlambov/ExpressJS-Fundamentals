const mongoose = require('mongoose');
const encryption = require('../utilities/encryption');

function getRequiredPropMsg(prop) {
    return `${prop} is required!`;
}

let userSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: getRequiredPropMsg('Username'),
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: getRequiredPropMsg('Password')
    },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: getRequiredPropMsg('First name')
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: getRequiredPropMsg('Last name')
    },
    age: {
        type: mongoose.Schema.Types.Number,
        min: [0, 'Age must be between 0 and 120'],
        max: [120, 'Age must be between 0 and 120']
    },
    gender: {
        type: mongoose.Schema.Types.String,
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender should be either "Male" or "Female"'
        }
    },
    roles: [{ type: mongoose.Schema.Types.String }],
    otherUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
});

userSchema.method({
    authenticate: function (password) {
        let hashedPassword = encryption.generateHashedPassword(this.salt, password);

        return hashedPassword === this.password;
    },
    hasAccess: function (role) {
        return this.roles.indexOf(role) !== -1;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
