/**
 * user model
 * defines the properties of a user, and methods associated with it
 * defines a schema to validate a user
 * defines methods to validate a user data from client
 *
 * a user has properties username, password and organizations
 * username is a string that will be used to identify username
 * password is a string
 * organizations is an array that contains organization objects
 */

const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 96,
    },
    password: { type: String, required: true, minlength: 4, maxlength: 1024 },
    organizations: { type: Array, default: [] },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(96).trim().required(),
        password: Joi.string().min(4).max(1024).trim().required(),
    });

    return schema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;
