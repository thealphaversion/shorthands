/**
 * this module has the following routes
 * /api/shorts/all                            -> GET       -> get all shorts of an organization
 * /api/shorts/create                         -> POST      -> creates a new short
 * /api/shorts/edit                           -> POST      -> modifies an exisitng short
 * /api/shorts/delete                         -> POST      -> deletes a short
 * /api/shorts/:id                            -> GET       -> get a short by id
 */

// package imports
const express = require("express");
const mongoose = require("mongoose");

// module imports
const auth = require("../middleware/auth");
const {
    Short,
    validateShort,
    validateShortObject,
} = require("../models/shorts");
const { Organization } = require("../models/organization");

const router = express.Router();

/**
 * /api/shorts/all  -> GET
 * get all shorts of an organization
 */
router.get("/all", auth, async (req, res) => {
    // the auth middleware sets the req.user property
    let shorts = await Short.find({ _id: req.user._id });
    res.status(200).send(shorts);
});

/**
 * /api/shorts/create  -> POST
 * creates a new short
 *
 * request body should have properties shorthand and description
 *
 * expected req.body = { "shorthand": shorthand, "description": description }
 *
 * created shorts have the properties upvotes and downvotes set to 0
 *
 * shorts can only be created by an organization
 */
router.post("/create", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateShort(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the organization exists
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    // check if the short already exists fot that organization
    let short = await Short.findOne({
        _id: organization._id,
        shorthand: req.body.shorthand,
    });
    if (short) {
        return res.status(400).send("Short already exists.");
    }

    short = new Short({
        organization_id: organization._id,
        shorthand: req.body.shorthand,
        description: req.body.description,
    });
    await short.save();

    res.status(200).send("Short successfully created");
});

/**
 * /api/shorts/edit  -> POST
 * modifies an exisitng short
 *
 * request body should have properties short_id, shorthand and description
 *
 * expected req.body = { "short_id": short_id, "shorthand": shorthand, "description": description }
 *
 * shorts can only be modified by an organization
 */
router.post("/edit", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateShortObject(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the short already exists fot that organization
    let short = await Short.findById(req.body.short_id);
    if (!short) {
        return res.status(400).send("Short does not exist.");
    }

    short.set({
        shorthand: req.body.shorthand,
        description: req.body.description,
    });
    await short.save();

    res.status(200).send("Short successfully edited.");
});

/**
 * /api/shorts/delete  -> POST
 * deletes a short
 *
 * request header should carry an auth token
 * request body should have properties short_id
 *
 * expected req.body = { "short_id": short_id }
 *
 * req.user._id set by the auth middleware will identify the organization
 * whose short has to be deleted
 *
 * a short can only be deleted by its organization
 */
router.post("/delete", auth, async (req, res) => {
    // validates if req.body is as expected
    if (!mongoose.Types.ObjectId.isValid(req.body.short_id)) {
        return res.status(400).send("Invalid short.");
    }

    let short = await Short.findByIdAndRemove(req.body.short_id);
    res.status(200).send(short.shorthand + " deleted.");
});
router.get("/:id", async (req, res) => {});

/**
 * /api/shorts/:id  -> GET
 * get a short by id
 */
router.get("/:id", auth, async (req, res) => {
    // validates if req.params is as expected
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).status("Invalid short.");
    }
    // the auth middleware sets the req.user property
    let shorts = await Short.findById(req.params.id);
    res.status(200).send(shorts);
});

module.exports = router;
