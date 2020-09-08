/**
 * this module has the following routes
 * /api/auth/users                              -> POST     -> authenticates (logs in) a user
 * /api/auth/organizations                      -> POST     -> authenticates (logs in) an organization
 */

// package imports
const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const cors = require("cors");

// module imports
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
 * authenticates (logs in) a user
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

    return res
        .status(200)
        .send({ token: token, username: user.username, type: "user" });
});

/**
 * /api/auth/organizations  -> POST
 * authenticates (logs in) an organization
 *
 * request body should have a property username and password
 *
 * expected req.body = { "username": username, "password": password }
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

    // finds organization using the username
    const organization = await Organization.findOne({
        username: req.body.username,
    });
    if (!organization) {
        return res.status(400).send("Invalid username or password");
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

    return res.status(200).send({
        token: token,
        username: organization.username,
        type: "organization",
    });
});

module.exports = router;
