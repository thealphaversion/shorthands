const express = require("express");
const {
    Invitation,
    validateInvitation,
    validateInvitationOperation,
} = require("../models/invitation");
const { Organization } = require("../models/organization");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const Fawn = require("fawn");
const mongoose = require("mongoose");

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
    const { error } = validateInvitation(req.body);
    if (error) {
        return res.status(400).send("Invalid request.");
    }

    // the auth middleware sets the req.user property
    let organization = await Organization.findById(req.user._id);
    if (!organization) {
        return res.status(400).send("Invalid organization.");
    }

    let target_user = await User.findById(req.body.user_id);
    if (!target_user) {
        return res.status(400).send("Invalid user.");
    }

    const invitation = new Invitation({
        organization: {
            _id: organization._id,
            name: organization.name,
        },
        user: {
            _id: target_user._id,
            username: target_user.username,
        },
    });

    await invitation.save();

    res.status(200).send(
        "Invite sent successfully to " + target_user.username + "."
    );
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
    const { error } = validateInvitationOperation(req.body);
    if (error) {
        return res.status(400).send("Invalid request.");
    }

    const status = {
        ACCEPTED: "accepted",
        REJECTED: "rejected",
    };

    let invitation = await Invitation.findById(req.body.id);
    if (!invitation) {
        return res.status(400).send("Invalid invitation.");
    }

    if (req.body.status === status.REJECTED) {
        invitation.set({
            status: status.REJECTED,
        });
        await invitation.save();

        res.status(200).send("Invitation rejected.");
    } else if (req.body.status === status.REJECTED) {
        let organization = await Organization.findById(
            invitation.organization._id
        );
        if (!organization) {
            return res.status(400).send("Invalid organization.");
        }

        let user = await User.findById(invitation.user._id);
        if (!user) {
            return res.status(400).send("Invalid user.");
        }

        try {
            new Fawn.Task()
                .update(
                    "users",
                    { _id: invitation.user._id },
                    {
                        $push: {
                            organizations: {
                                _id: organization._id,
                                name: organization.name,
                            },
                        },
                    }
                )
                .update(
                    "organizations",
                    { _id: invitation.organization._id },
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

        res.status(200).send("Invitation successfully accepted.");
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

module.exports = router;
