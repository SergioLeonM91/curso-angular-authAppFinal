
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, _id, ...user } = this.toObject();
    user.uuid = _id;
    return user;
}

module.exports = model( 'User', UserSchema );