const express = require("express");
const bcrypt = require("bcrypt");
const {
    Organization,
    validateOrganization,
    validateOrganizationObject,
} = require("../models/organization");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/all", async (req, res) => {
    let organizations = await Organization.find().select({ name: 1 });
    res.status(200).send(organizations);
});

// create a new organization
router.post("/create", async (req, res) => {
    const { error } = validateOrganization(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let organization = await Organization.findOne({
        name: req.body.name,
    });
    if (organization) {
        return res.status(400).send("Organization already registered.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    organization = new Organization({
        name: req.body.name,
        password: hashedPassword,
    });

    await organization.save();

    const token = organization.generateAuthToken();
    res.status(200)
        .header("x-auth-token", token)
        .send(organization.name + " created successfully!");
});

// updates all organization properties except password and those that are set by the server
router.post("/edit", auth, async (req, res) => {
    // req.body = { "organization": organizationObject }
    // organizationObject = { "_id": ObjectID, "name": String, "password": "String" }
    const { error } = validateOrganizationObject(req.body.organization);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    organization.set({
        name: req.body.organization.name,
    });
    await organization.save();

    res.status(200).send(organization.name);
});

// updates organization password
router.post("/change_password", auth, async (req, res) => {
    // req.body = { "organization": organizationObject }
    // organizationObject = { "_id": ObjectID, "name": String, "password": "String" }
    const { error } = validateUserObject(req.body.organization);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
        req.body.organization.password,
        salt
    );

    organization.set({
        password: hashedPassword,
    });
    await organization.save();

    res.status(200).send(organization.name);
});

// deletes organization
router.post("/delete", auth, async (req, res) => {
    // req.body = { "organization": userObject }
    // organizationObject = { "_id": ObjectID, "name": String, "password": "String" }
    const { error } = validateUserObject(req.body.organization);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let organization = await Organization.findByIdAndRemove(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    res.status(200).send(organization.name);
});

module.exports = router;
