/**
 * this module has the following routes
 * /api/search/organizations/:username          -> GET      -> returns a list of organizations whose username matches with the query
 * /api/search/users/:username                  -> GET      -> returns a list of users whose usernames match with the query
 * /api/search/shorts                           -> GET      -> returns a list of shorts that match with the query
 */

// package imports
const express = require("express");
const mongoose = require("mongoose");

// module imports
const auth = require("../middleware/auth");
const { Organization } = require("../models/organization");
const { User } = require("../models/user");
const { Short } = require("../models/shorts");

const router = express.Router();

/**
 * /api/search/organizations/:username  -> GET
 * returns a list of organizations whose name matches with the query
 *
 * request header should carry an auth token
 * request params should have a property username
 */
router.get("/organizations/:name", auth, async (req, res) => {
    // validates if req.params is as expected
    if (!req.params.username) {
        return res.status(400).send("Invalid query.");
    }

    const organizations = await Organization.find({
        username: req.params.username,
    }).select({ password: -1 });

    res.status(200).send(organizations);
});

/**
 * /api/search/users/:username  -> GET
 * returns a list of users whose usernames match with the query
 *
 * request header should carry an auth token
 * request params should have a property username
 */
router.get("/users/:username", auth, async (req, res) => {
    // validates if req.params is as expected
    if (!req.params.username) {
        return res.status(400).send("Invalid query.");
    }

    const users = await User.find({
        username: req.params.username,
    }).select({ password: -1 });

    res.status(200).send(users);
});

/**
 * /api/search/shorts  -> GET
 * returns a list of shorts that match with the query
 *
 * request header should carry an auth token
 * request query should have properties shorthand and organization_id
 *
 * query: shorthand = shorthand & organization_id = organization_id
 */
router.get("/shorts", auth, async (req, res) => {
    // validates if req.query is as expected
    if (!req.query.organization_id) {
        return res
            .status(400)
            .send({ message: "Invalid request. No organization id provided." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.query.organization_id)) {
        return res.status(400).send("Invalid organization.");
    }

    /*
    if (!req.query.shorthand) {
        return res.status(400).send("Invalid query.");
    }
    */

    // check if the organization exists
    let organization = await Organization.findById(req.query.organization_id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    let queryString = req.query.shorthand;
    let regex = new RegExp(`.*${queryString}.*`, "i");

    const shorts = await Short.find({
        shorthand: regex,
        organization_id: req.query.organization_id,
    }).sort({
        shorthand: 1,
    });

    return res.status(200).send({ shorts: shorts });
});

module.exports = router;
