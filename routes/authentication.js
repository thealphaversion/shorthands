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

/**
 * /api/auth/users  -> POST
 * authenticates (log in) a user
 *
 * request body should have a property username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * response returns a JSON Web Token
 * client should store it
 */
router.post("/users", async (req, res) => {
    // checks if request body is as expected
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // finds user using the username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send("Invalid username or password");
    }

    // checking if password is correct
    const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validatePassword) {
        return res.status(400).send("Invalid username or password");
    }

    // generates JSON Web Token
    const token = user.generateAuthToken();

    return res.status(200).send(token);
});

/**
 * /api/auth/organizations  -> POST
 * authenticates (log in) an organization
 *
 * request body should have a property name and password
 *
 * expected req.body = { "name": name, "password": password }
 *
 * response returns a JSON Web Token
 * client should store it
 */
router.post("/organizations", async (req, res) => {
    // checks if request body is as expected
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // finds organization using the name
    const organization = await Organization.findOne({ name: req.body.name });
    if (!organization) {
        return res.status(400).send("Invalid name or password");
    }

    // checking if password is correct
    const validatePassword = await bcrypt.compare(
        req.body.password,
        organization.password
    );

    if (!validatePassword) {
        return res.status(400).send("Invalid username or password");
    }

    // generates JSON Web Token
    const token = organization.generateAuthToken();

    return res.status(200).send(token);
});

module.exports = router;
