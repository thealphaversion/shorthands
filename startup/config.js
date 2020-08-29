const config = require("config");

module.exports = function () {
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
        // as a best practice, always throw errors instead of using strings
        // because then the stacktrace will be available to use later
        // process.exit(1);        // 0 means success, anything oother than 0 is failure
    }
};
