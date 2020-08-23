const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
    const token = req.header("x-auth-token");

    // if we don't have a token
    if (!token) {
        // then the request is not authorised and we return a 401 response.
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (ex) {
        // if token is invalid, then the request doesn't have the right data and we return a 400 response.
        res.status(400).send("Invalid token.");
    }
}

module.exports = auth;
