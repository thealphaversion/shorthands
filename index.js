// package imports
const express = require("express");
const winston = require("winston");

// the express application that we'll use to
// construct the request, response pipeline
const app = express();

// logging and unhandled error handling
require("./startup/logs");

// declaring routes
require("./startup/routes")(app);

// connecting to mongodb
require("./startup/db")();

// if the private key is not defined in the env, shut doen the server
require("./startup/config")();

// this helps us validate mongo db object ids
require("./startup/validate")();

// start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    winston.info(`Listening on port ${port}...`)
);
