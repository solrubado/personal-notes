'use strict';
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    created_at: Date,
    updated_at: Date,
    hash: String,
    salt: String,
});

UserSchema.pre('save', function (next) {
    // get the current date
    const currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

UserSchema.methods.setPassword = function (password) {
    if (!password) return;
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

};

UserSchema.methods.validatePassword = function (password) {
    if (!password) return false;
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}


UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('Users', UserSchema);