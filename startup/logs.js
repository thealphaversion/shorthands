require("express-async-errors"); // this package will monkey patch route handlers at runtime
const winston = require("winston");
// require('winston-mongodb');

module.exports = function () {
    /*
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
*/
    winston.exceptions.handle(
        new winston.transports.File({ filename: "uncaughtExceptions.log" }),
        new winston.transports.Console({ colorize: true, prettyPrint: true })
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }));
};
