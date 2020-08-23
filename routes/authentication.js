const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");
const { Organization } = require("../models/organization");

const router = express.Router();

const validateUser = (req) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(96).trim().required(),
        password: Joi.string().min(4).max(1024).trim().required(),
    });

    return schema.validate(req);
};

const validateOrganization = (req) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(96).trim().required(),
        password: Joi.string().min(4).max(1024).trim().required(),
    });

    return schema.validate(req);
};

router.post("/user", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send("Invalid username or password");
    }

    const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validatePassword) {
        return res.status(400).send("Invalid username or password");
    }

    const token = user.generateAuthToken();

    return res.status(200).send(token);
});

router.post("/organization", async (req, res) => {
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const organization = await Organization.findOne({ name: req.body.name });
    if (!organization) {
        return res.status(400).send("Invalid name or password");
    }

    const validatePassword = await bcrypt.compare(
        req.body.password,
        organization.password
    );

    if (!validatePassword) {
        return res.status(400).send("Invalid username or password");
    }

    const token = organization.generateAuthToken();

    return res.status(200).send(token);
});

module.exports = router;
