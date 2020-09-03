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
const { Organization } = require("../../../models/organization");

/**
 * Test suite - auth middleware
 *
 * Tests 3 execution paths
 * 1. if no auth token is provided
 * 2. if auth token provided is invalid
 * 3. if auth token provided is valid
 *
 * the test runs on the /api/shorts/all -> GET route
 */
describe("auth middleware", () => {
    let server;
    let token;

    beforeEach(() => {
        server = require("../../../index");
        token = new Organization().generateAuthToken();
    });
    afterEach(async () => {
        await server.close();
    });

    const exec = () => {
        return request(server)
            .get("/api/shorts/all")
            .set("x-auth-token", token);
    };

    test("should return 401 if no token is provided", async () => {
        token = "";

        const res = await exec();

        expect(res.status).toBe(401);
    });

    test("should return 400 if token is invalid", async () => {
        token = "token";

        const res = await exec();

        expect(res.status).toBe(400);
    });

    test("should return 200 if token is valid", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
