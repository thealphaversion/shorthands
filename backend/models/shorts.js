/**
 * shorts model
 * defines the properties of a short
 * defines a schema to validate a short
 * defines methods to validate a short data from client
 *
 * a short has properties shorthand, description, upvotes and downvotes
 * shorthand is the acronym or a term
 * description is the definition or description for the shorthand
 * upvotes is the number of upvotes for the short
 * downvotes is the number of downvotes for the short
 */

const mongoose = require("mongoose");
const Joi = require("joi");

const shortsSchema = new mongoose.Schema({
    organization_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    shorthand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
    },
    upvotes: { type: Array, default: [] },
    downvotes: { type: Array, default: [] },
});

const Short = mongoose.model("Short", shortsSchema);

const validateShort = (shorthand) => {
    const schema = Joi.object({
        shorthand: Joi.string().required(),
        description: Joi.string().min(5).required(),
    });

    return schema.validate(shorthand);
};

const validateShortObject = (shorthand) => {
    const schema = Joi.object({
        short_id: Joi.objectId().required(),
        shorthand: Joi.string().required(),
        description: Joi.string().min(5).required(),
    });

    return schema.validate(shorthand);
};

exports.Short = Short;
exports.validateShort = validateShort;
exports.validateShortObject = validateShortObject;
