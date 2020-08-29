const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    /*
    const db = config.get('db');
    mongoose.connect(db).then(() => {
        winston.info(`Connected to ${db} ...`);
    });
    */
    const db = config.get("db");
    mongoose
        .connect(process.env.MONGODB_URI || db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            winston.info(`Connected to mongodb ${db}...`);
        });
};
