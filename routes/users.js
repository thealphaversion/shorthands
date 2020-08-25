const express = require("express");
const bcrypt = require("bcrypt");
const { User, validateUser, validateUserObject } = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

// gets the current user
router.get("/current", auth, async (req, res) => {
    const user = User.findById(req.user._id).select({ password: -1 });
    res.send(user);
});

// registers a new user
router.post("/create", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send("User already registered.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
        username: req.body.username,
        password: hashedPassword,
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(user.username);
});

// updates all user properties except password  and those that are set by the server
router.post("/edit", auth, async (req, res) => {
    // req.body is expected to at least have { "user": userObject }
    // userObject = { "_id": ObjectID, "username": String, "password": "String" }
    const { error } = validateUserObject(req.body.user);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    user.set({
        username: req.body.user.username,
        // organizations: req.body.user.organizations,
    });
    await user.save();

    res.status(200).send(user.username);
});

// updates user password
router.post("/change_password", auth, async (req, res) => {
    // req.body is expected to at least have { "user": userObject }
    // userObject = { "_id": ObjectID, "username": String, "password": "String" }
    const { error } = validateUserObject(req.body.user);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.user.password, salt);

    user.set({
        password: hashedPassword,
    });
    await user.save();

    res.status(200).send(user.username);
});

// deletes user
router.post("/delete", auth, async (req, res) => {
    // req.body is expected to at least have { "user": userObject }
    // userObject = { "_id": ObjectID, "username": String, "password": "String" }
    const { error } = validateUserObject(req.body.user);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    let user = await User.findByIdAndRemove(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    res.status(200).send(user.username + " successfully deleted.");
});

module.exports = router;
