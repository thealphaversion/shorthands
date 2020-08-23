// package imports
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");

// route imports
const users = require("./routes/users");
const organization = require("./routes/organizations");
const auth = require("./routes/authentication");

// this helps us validate mongo db object ids
Joi.objectId = require("joi-objectid")(Joi);

// the express application that we'll use to
// construct the request, response pipeline
const app = express();

// if the private key is not defined in the env, shut doen the server
if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: No key defined.");
    process.exit(1);
}

// connecting to mongodb
mongoose
    .connect("mongodb://localhost/shorts", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log("Database error: " + err);
    });

// to decode json data in request.body
app.use(express.json());

// all api endpoints that start with /api/auth are handled by this
app.use("/api/auth", auth);

// all api endpoints that start with /api/users are handled by this
app.use("/api/users", users);

// all api endpoints that start with /api/organization are handled by this
app.use("/api/organization", organization);

// start server
app.listen(3000, () => console.log("Server started on port 3000"));
