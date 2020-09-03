/**
 * invitation model
 * defines the properties of a invitation
 * defines a schema to validate a invitation
 * defines methods to validate invitation data from client
 *
 * an invitation has properties organization, user, status and date
 * an invitation is sent by an organization to a user
 * organization is the organization from which the invitation originated
 * user is the user to which the invitation was sent
 * status decides if the user hasn't responded to the invite, accepted it or rejected it
 * date records the date when the invite was sent
 */

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
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 96,
    },
});

const invitationSchema = new mongoose.Schema({
    organization: {
        type: organizationSchema,
        required: true,
    },
    user: {
        type: userSchema,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "rejected"],
        lowercase: true,
        default: "pending",
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Invitation = mongoose.model("Invitation", invitationSchema);

const validateInvitation = (invitation) => {
    const schema = Joi.object({
        user_id: Joi.objectId().required(),
    });

    return schema.validate(invitation);
};

const validateInvitationOperation = (invitation) => {
    const schema = Joi.object({
        id: Joi.objectId().required(),
        status: Joi.string().valid("accepted", "rejected"),
    });

    return schema.validate(invitation);
};

exports.Invitation = Invitation;
exports.validateInvitation = validateInvitation;
exports.validateInvitationOperation = validateInvitationOperation;
