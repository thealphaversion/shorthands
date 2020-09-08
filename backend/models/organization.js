/**
 * organization model
 * defines the properties of a short, and methods associated with it
 * defines a schema to validate an organization
 * defines methods to validate an organization data from client
 *
 * an organization has properties name, password, users and shorts
 * name is a string that will be used to identify name
 * password is a string
 * users is an array that contains user objects
 * shorts is an array that contains short objects
 */

const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const organizationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 96,
    },
    password: { type: String, required: true, minlength: 4, maxlength: 1024 },
    users: { type: Array, default: [] },
});

organizationSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

const Organization = mongoose.model("Organization", organizationSchema);

const validateOrganization = (organization) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(96).required(),
        password: Joi.string().min(4).max(1024).required(),
    });

    return schema.validate(organization);
};

exports.Organization = Organization;
exports.validateOrganization = validateOrganization;
