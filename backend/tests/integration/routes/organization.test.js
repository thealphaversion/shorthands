/**
 * This integration test module tests the auth middleware
 */

// package imports
const request = require("supertest");
const bcrypt = require("bcrypt");

// module imports
const { Organization } = require("../../../models/organization");

let server;
let token;

/**
 * Test suite - /api/organization/
 *
 * Tests 2 routes
 * 1. get the current organization
 * 2. create a new organization
 *
 * the test runs on the /api/organization/
 */

describe("/api/organizations", () => {
    /**
     * This tests the /api/organization/current -> GET route
     *
     * Only one test case
     * the test should return the current organization
     */
    beforeEach(() => {
        // start server connection
        server = require("../../../index");
    });

    afterEach(async () => {
        // clear the database
        await Organization.collection.remove({});
        // close server connection
        await server.close();
    });

    describe("GET /current", () => {
        // expected correct request
        const exec = async () => {
            return await request(server)
                .get("/api/organizations/current")
                .set("x-auth-token", token);
        };

        test("should return the current organization", async () => {
            // create a test organization
            const organization = new Organization({
                name: "test_org",
                password: "test1234",
            });
            await organization.save();

            // generate token for test organization
            token = organization.generateAuthToken();

            // try to get the test organization
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                name: "test_org",
            });
        });
    });
});
