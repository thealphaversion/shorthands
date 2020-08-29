/**
 * this module has the following routes
 * /api/users/current                           -> GET      -> gets the current user
 * /api/users/create                            -> POST     -> creates a new user
 * /api/users/edit                              -> POST     -> updates username of a user
 * /api/users/change_password                   -> POST     -> updates password of a user
 * /api/users/delete                            -> POST     -> deletes an user
 */

// package imports
const express = require("express");
const bcrypt = require("bcrypt");

// module imports
const auth = require("../middleware/auth");
const { User, validateUser } = require("../models/user");

const router = express.Router();

/**
 * /api/users/current  -> GET
 * gets the current user
 *
 * request header should carry an auth token
 *
 * finds the current user using the req.user._id property set by the auth middleware
 *
 * returns the logged in user object without its password
 */
router.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ username: 1 });
    res.send(user);
});

/**
 * /api/users/create  -> POST
 * creates a new user
 *
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * created users have the property organizations set to empty arrays
 *
 * returns a JSON Web Token in the response header
 * should be saved by the client
 */
router.post("/create", async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the user already exists
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send("User already registered.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    user = new User({
        username: req.body.username,
        password: hashedPassword,
    });
    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send(user.username);
});

/**
 * /api/users/edit  -> POST
 * updates username of a user
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the user whose username is to be updated
 * username will be the target state of that user.username property
 *
 * username can only be modified by an user
 */
router.post("/edit", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the user exists
    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    // update username property of user
    user.set({
        username: req.body.username,
    });
    await user.save();

    res.status(200).send(user.username);
});

/**
 * /api/users/change_password  -> POST
 * updates password of a user
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the user whose password is to be updated
 * password will be the target state of that user.password property
 *
 * user password can only be modified by an user
 */
router.post("/change_password", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the user exists
    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // update password property of user
    user.set({
        password: hashedPassword,
    });
    await user.save();

    res.status(200).send(user.username);
});

/**
 * /api/users/delete  -> POST
 * deletes a user
 *
 * request header should carry an auth token
 * request body should have properties username and password
 *
 * expected req.body = { "username": username, "password": password }
 *
 * req.user._id set by the auth middleware will identify the user that is to be deleted
 * first the req.body.password will be compared with user.password
 * if password matches, user will be deleted
 * otherwise return status code 400 with message password incorrect.
 *
 * user can only be a user
 */
router.post("/delete", auth, async (req, res) => {
    // validates if req.body is as expected
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // the auth middleware sets the req.user property
    // check if the user exists
    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid user.");
    }

    // checking if password is correct
    const validatePassword = await bcrypt.compare(
        req.body.password,
        organization.password
    );

    if (!validatePassword) {
        return res.status(400).send("Incorrect password");
    }

    user = await User.findByIdAndRemove(req.user._id);

    res.status(200).send(user.username + " successfully deleted.");
});

module.exports = router;
