/**
 * this module has the following routes
 * /api/organizations/current                           -> GET      -> gets the current organization
 * /api/organizations/create                            -> POST     -> creates a new organization
 * /api/organizations/edit                              -> POST     -> updates name of an organization
 * /api/organizations/change_password                   -> POST     -> updates password of an organization
 * /api/organizations/delete                            -> POST     -> deletes an organization
 */

// package imports
const express = require("express");
const bcrypt = require("bcrypt");

// module imports
const auth = require("../middleware/auth");
const {
    Organization,
    validateOrganization,
} = require("../models/organization");

const router = express.Router();

/**
 * /api/organizations/current  -> GET
 * gets the current organization
 *
 * request header should carry an auth token
 *
 * finds the current organization that is logged in using the req.user._id property set by the auth middleware
 *
 * if organization doesn't exist, returns 404.
 *
 * returns the logged in organization username and users
 */
router.get("/current", auth, async (req, res) => {
    const organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(404).send("No organization with given id exists.");
    }
    res.status(200).send({
        username: organization.username,
        users: organization.users,
    });
});

router.get("/all", auth, async (req, res) => {
    const organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(404).send("No organization with given id exists.");
    }
    res.status(200).send({ username: organization.username });
});

/**
 * /api/organizations/create  -> POST
 * creates a new organization
 *
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * created organizations have the property users set to empty arrays
 *
 * returns a JSON Web Token in the response header
 * should be saved by the client
 */
router.post("/create", async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the organization already exists
    let organization = await Organization.findOne({
        username: req.body.username,
    });
    if (organization) {
        return res.status(400).send("Organization already registered.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new organization
    organization = new Organization({
        username: req.body.username,
        password: hashedPassword,
    });

    await organization.save();

    // generate auth token
    const token = organization.generateAuthToken();

    return res.status(200).send({
        token: token,
        username: organization.username,
        type: "organization",
    });
});

/**
 * /api/organizations/edit  -> POST
 * updates username of an organization
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the organization whose username is to be updated
 * username will be the target state of that organization.username property
 *
 * organization username can only be modified by an organization
 */
router.post("/edit", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the organization exists
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    // update username property of organization
    organization.set({
        username: req.body.username,
    });
    await organization.save();

    res.status(200).send(organization.username);
});

/**
 * /api/organizations/change_password  -> POST
 * updates password of an organization
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the organization whose password is to be updated
 * password will be the target state of that organization.password property
 *
 * organization password can only be modified by an organization
 */
router.post("/change_password", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the organization exists
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // update password property of organization
    organization.set({
        password: hashedPassword,
    });
    await organization.save();

    res.status(200).send(organization.username);
});

/**
 * /api/organizations/delete  -> POST
 * deletes an organization
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the organization that is to be deleted
 * first the req.body.password will be compared with organization.password
 * if password matches, organization will be deleted
 * otherwise return status code 400 with message password incorrect.
 *
 * organization can only be deleted by an organization
 */
router.post("/delete", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    // checking if password is correct
    const validatePassword = await bcrypt.compare(
        req.body.password,
        organization.password
    );

    if (!validatePassword) {
        return res.status(400).send("Incorrect password");
    }

    organization = await Organization.findByIdAndRemove(req.user._id);

    res.status(200).send(organization.username + " deleted.");
});

module.exports = router;
