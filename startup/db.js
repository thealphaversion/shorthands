const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
    /*
    const db = config.get('db');
    mongoose.connect(db).then(() => {
        winston.info(`Connected to ${db} ...`);
    });
    */
    mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost/shorts", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            winston.info(`Connected to mongodb ...`);
        });
};
