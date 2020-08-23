const mongoose = require("mongoose");
const Joi = require("joi");

const shortsSchema = new mongoose.Schema({
    shorthand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
    },
    upvotes: { type: Number, default: 0, min: 0 },
    downvotes: { type: Number, default: 0, min: 0 },
});

const Short = mongoose.model("Short", shortsSchema);

const validateShort = (shorthand) => {
    const schema = Joi.object({
        shorthand: Joi.string().required(),
        description: Joi.string().min(5).required(),
        upvotes: Joi.number().min(0),
        downvotes: Joi.number().min(0),
    });

    return schema.validate(shorthand);
};

exports.Short = Short;
exports.validateShort = validateShort;
