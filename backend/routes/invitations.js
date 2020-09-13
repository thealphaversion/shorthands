/**
 * this module has the following routes
 * /api/invitations/create                              -> POST     -> creates new invitation
 * /api/invitations/modify                              -> POST     -> modifies the status of an invitation
 * /api/invitations/delete                              -> POST     -> deletes an invitation
 * /api/invitations/all/user                            -> GET      -> gets all invitations for a user
 * /api/invitations/all/user/:status                    -> GET      -> gets all invitations for an organization filtered by status
 * /api/invitations/all/organization                    -> GET      -> gets all invitations for a user
 * /api/invitations/all/organization/:status            -> GET      -> gets all invitations for an organization filtered by status
 */

// package imports
const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");

// module imports
const auth = require("../middleware/auth");
const {
    Invitation,
    validateInvitation,
    validateInvitationOperation,
} = require("../models/invitation");
const { Organization } = require("../models/organization");
const { User } = require("../models/user");

const router = express.Router();
Fawn.init(mongoose);

/**
 * /api/invitations/create  -> POST
 * creates a new invitation
 *
 * request header should carry an auth token
 * request body should have a property user_id
 *
 * expected req.body = { "user_id": user_id }
 *
 * invitations can only be created by an organization
 *
 * created invitations have the property status set to pending
 */
router.post("/create", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateInvitation(req.body);
    if (error) {
        return res.status(400).send("Invalid request.");
    }

    // the auth middleware sets the req.user property
    // check if the organization exists
    let organization = await Organization.findById(req.user._id);

    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    // check if the user exists
    let target_user = await User.findById(req.body.user_id);

    if (!target_user) {
        return res.status(400).send("Invalid user.");
    }

    // create new invitation
    const invitation = new Invitation({
        organization_id: organization._id,
        user_id: target_user._id,
    });

    await invitation.save();

    res.status(200).send("Invite sent successfully.");
});

/**
 * /api/invitations/modify  -> POST
 * modifies the status of an invitation
 *
 * request header should carry an auth token
 * request body should have properties id and status
 *
 * expected req.body = { "id": id, "status": status }
 *
 * id will identify the invitation to be modified
 * status will be the target state of that invitation.status property
 *
 * invitation status can only be modified by a user
 */
router.post("/modify", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateInvitationOperation(req.body);
    if (error) {
        return res.status(400).send("Invalid request.");
    }

    const status = {
        ACCEPTED: "accepted",
        REJECTED: "rejected",
    };

    // check if the invitation exists
    let invitation = await Invitation.findById(req.body.id);
    if (!invitation) {
        return res.status(400).send("Invalid invitation.");
    }

    // branch out between accepted and rejected invitations
    if (req.body.status === status.REJECTED) {
        // if the user rejects an invitation

        invitation.set({
            status: status.REJECTED,
        });
        await invitation.save();

        return res.status(200).send("Invitation rejected.");
    } else if (req.body.status === status.ACCEPTED) {
        // if the user accepts the invitation

        // check if the organization exists
        let organization = await Organization.findById(
            invitation.organization_id
        );
        if (!organization) {
            return res.status(400).send("Invalid organization.");
        }

        // check if the user exists
        let user = await User.findById(invitation.user_id);
        if (!user) {
            return res.status(400).send("Invalid user.");
        }

        // using Fawn to perform a two phase commit so that all the three
        // update operations are either all completed or none at all.
        try {
            new Fawn.Task()
                .update(
                    "users",
                    { _id: invitation.user_id },
                    {
                        $push: {
                            organizations: {
                                _id: organization._id,
                                username: organization.username,
                            },
                        },
                    }
                )
                .update(
                    "organizations",
                    { _id: invitation.organization_id },
                    {
                        $push: {
                            users: {
                                _id: user._id,
                                username: user.username,
                            },
                        },
                    }
                )
                .update(
                    "invitations",
                    { _id: invitation._id },
                    { status: status.ACCEPTED }
                )
                .run();
        } catch (ex) {
            return res.status(500).send("Error completing task.");
        }

        return res.status(200).send("Invitation successfully accepted.");
    }
});

/**
 * /api/invitations/delete  -> POST
 * deletes an invitation
 *
 * request header should carry an auth token
 * request body should have a property id
 *
 * expected req.body = { "id": id, "status": status }
 *
 * invitations can only be deleted by an organization
 */
router.post("/delete", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateInvitationOperation(req.body);
    if (error) {
        return res.status(400).send("Invalid request.");
    }

    let invitation = await Invitation.findByIdAndRemove(req.body.id);
    if (!invitation) {
        return res.status(400).send("Invalid invitation.");
    }

    res.status(200).send("Invitation successfully deleted.");
});

/**
 * /api/invitations/all/user  -> GET
 * gets all invitations for a user
 *
 * request header should carry an auth token
 *
 * returns a list of all invitations for the user
 */
router.get("/all/user", auth, async (req, res) => {
    // list of all invitations for a particular user
    // the auth middleware sets the req.user property
    let invitations = await Invitation.find({
        user_id: { _id: req.user._id },
    }).populate("organization_id", "username");
    res.status(200).send({ invitations: invitations });
});

/**
 * /api/invitations/all/user/:status  -> GET
 * gets all invitations for a user filtered by status
 *
 * request header should carry an auth token
 *
 * returns a list of all invitations for the user
 */
router.get("/all/user/:status", auth, async (req, res) => {
    // validates if req.params is as expected
    let status_list = ["pending", "accepted", "rejected"];
    let status = req.params.status.toLowerCase();
    if (!status_list.includes(status)) {
        return res.status(400).send("Invalid parameters.");
    }

    // list of invitations filtered by status for a particular user
    // the auth middleware sets the req.user property
    let invitations = await Invitation.find({
        user_id: { _id: req.user._id },
        status: status,
    }).populate("user", "username");
    res.status(200).send({ invitations: invitations });
});

/**
 * /api/invitations/all/organization  -> GET
 * gets all invitations for an organization
 *
 * request header should carry an auth token
 *
 * returns a list of all invitations for the organization
 */
router.get("/all/organization", auth, async (req, res) => {
    // list of all invitations for a particular organization
    // the auth middleware sets the req.user property
    let invitations = await Invitation.find({
        organization_id: { _id: req.user._id },
    }).populate("organization", "username");
    res.status(200).send({ invitations: invitations });
});

/**
 * /api/invitations/all/organization/:status  -> GET
 * gets all invitations for an organization filtered by status
 *
 * request header should carry an auth token
 *
 * returns a list of all invitations for the user
 */
router.get("/all/organization/:status", auth, async (req, res) => {
    // validates if req.params is as expected
    let status_list = ["pending", "accepted", "rejected"];
    let status = req.params.status.toLowerCase();
    if (!status_list.includes(status)) {
        return res.status(400).send("Invalid parameters.");
    }

    // list of invitations filtered by status for a particular organization
    // the auth middleware sets the req.user property
    let invitations = await Invitation.find({
        organization_id: { _id: req.user._id },
        status: status,
    }).populate("organization", "username");
    res.status(200).send({ invitations: invitations });
});

module.exports = router;
