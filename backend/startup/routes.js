// package imports
const express = require("express");

// route imports
const auth = require("../routes/authentication");
const users = require("../routes/users");
const organization = require("../routes/organizations");
const invitations = require("../routes/invitations");
const shorts = require("../routes/shorts");
const search = require("../routes/search");

// middleware imports
const error = require("../middleware/error");

module.exports = function (app) {
    // to decode json data in request.body
    app.use(express.json());

    // all api endpoints that start with /api/auth are handled by this
    app.use("/api/auth", auth);

    // all api endpoints that start with /api/users are handled by this
    app.use("/api/users", users);

    // all api endpoints that start with /api/organization are handled by this
    app.use("/api/organizations", organization);

    // all api endpoints that start with /api/invitations are handled by this
    app.use("/api/invitations", invitations);

    // all api endpoints that start with /api/shorts are handled by this
    app.use("/api/shorts", shorts);

    // all api endpoints that start with /api/search are handled by this
    app.use("/api/search", search);

    app.use(error);
};
