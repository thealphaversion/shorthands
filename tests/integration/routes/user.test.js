/**
 * This integration test module tests the auth middleware
 *
 * Contains 1 test suite, auth middleware, that
 * tests all three execution paths of the middleware module
 *
 */

// package imports
const request = require("supertest");

// module imports
const { User } = require("../../../models/user");

let server;
let token;

/**
 * Test suite - /api/users/
 *
 * Tests 1 routes
 * 1. get the current user
 *
 *
 * the test runs on the /api/users/
 */

describe("/api/users", () => {
    beforeEach(() => {
        server = require("../../../index");
    });
    afterEach(async () => {
        await server.close();
    });

    /**
     * This tests the /api/users/current -> GET route
     */
    describe("GET /current", () => {
        afterEach(async () => {
            await User.collection.remove({});
        });

        // expected correct request
        const exec = async () => {
            return await request(server)
                .get("/api/users/current")
                .set("x-auth-token", token);
        };

        test("should return the current user", async () => {
            const user = new User({
                username: "test_user",
                password: "test1234",
            });
            await user.save();

            token = user.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                username: "test_user",
            });
        });
    });
});
