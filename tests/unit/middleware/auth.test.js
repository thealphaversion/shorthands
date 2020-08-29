/**
 * This unit test module tests the auth middleware
 *
 * Contains 1 test suite, auth middleware, that
 * tests all three execution paths of the middleware module
 *
 */

// package imports
const mongoose = require("mongoose");

// module imports
const { User } = require("../../../models/user");

// middleware imports
const auth = require("../../../middleware/auth");

/**
 * Test suite - auth middleware
 *
 * Tests 1 function - json web token payload is decoded correctly
 */
describe("auth middleware", () => {
    it("should populate req.user with the payload of a valid JSON Web Token", async () => {
        const user = { _id: mongoose.Types.ObjectId().toHexString() };
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token),
        };
        const res = {};

        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});
