const mongoose = require("mongoose");
const Joi = require("joi");

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 96,
    },
    password: { type: String, required: true, minlength: 4, maxlength: 1024 },
    users: { type: Array, default: [] },
    shorts: { type: Array, default: [] },
});

organizationSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

const Organization = mongoose.model("Organization", organizationSchema);

const validateOrganization = (organization) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(96).required(),
        password: Joi.string().min(4).max(1024).required(),
    });

    return schema.validate(organization, schema);
};

const validateOrganizationObject = (organization) => {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().min(1).max(96).trim().required(),
        password: Joi.string().min(4).max(1024).trim().required(),
    });

    return schema.validate(organization);
};

exports.Organization = Organization;
exports.validateOrganization = validateOrganization;
exports.validateOrganizationObject = validateOrganizationObject;
