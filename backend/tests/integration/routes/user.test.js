/**
 * This integration test module tests the user route
 */

// package imports
const request = require("supertest");
const bcrypt = require("bcrypt");

// module imports
const { User } = require("../../../models/user");

let server;
let token;

/**
 * Test suite - /api/users/
 *
 * Tests 2 routes
 * 1. get the current user
 * 2. create a new user
 *
 * the test runs on the /api/users/
 */

describe("/api/users", () => {
    /**
     * This tests the /api/users/current -> GET route
     *
     * Only one test case
     * the test should return the current user
     */

    beforeEach(() => {
        // start server connection
        server = require("../../../index");
    });

    afterEach(async () => {
        // clear the database
        await User.collection.remove({});

        // close server connection
        await server.close();
    });

    describe("GET /current", () => {
        // expected correct request
        const exec = async () => {
            return await request(server)
                .get("/api/users/current")
                .set("x-auth-token", token);
        };

        test("should return the current user", async () => {
            // create a test user
            const user = new User({
                username: "test_user",
                password: "test1234",
            });
            await user.save();

            // generate token for test user
            token = user.generateAuthToken();

            // try to get the test user
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                username: "test_user",
            });
        });
    });

    /**
     * These test the /api/users/create -> POST route
     *
     * Three test cases
     * 1. test if req body is invalid
     * 2. test if user already exists
     * 3. test if the user is created
     */
    describe("POST /create", () => {
        test("should return status 400 if req body is invalid", async () => {
            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/create")
                    .send({ name: "test_user" });
            };

            // try to create the user with invalid schema
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should return status 400 if user already exists", async () => {
            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/create")
                    .send({ username: "test_user", password: "test1234" });
            };

            // create an identical user
            const user = new User({
                username: "test_user",
                password: "test1234",
            });
            await user.save();

            // try to create the same user again
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should create a new user", async () => {
            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/create")
                    .send({ username: "test_user", password: "test1234" });
            };

            // try to create a user
            const res = await exec();

            // search for the created user in the db
            const user = await User.find({ username: "test_user" });

            expect(res.status).toBe(200);
            expect(user).toBeTruthy();
        });
    });

    /**
     * These test the /api/users/edit -> POST route
     *
     * Three test cases
     * 1. test if req body is invalid
     * 2. test if user does not exists
     * 3. test if the user is edited
     */
    describe("POST /edit", () => {
        test("should return status 400 if req body is invalid", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/edit")
                    .set("x-auth-token", token)
                    .send({ name: "test_user" });
            };

            // try to create the user with invalid schema
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should return status 400 if user does not exists", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/edit")
                    .set("x-auth-token", token)
                    .send({ username: "test_user", password: "test1234" });
            };

            // try to edit a user that does not exist
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should edit a user successfully", async () => {
            // create an identical user
            const user = new User({
                username: "test_user",
                password: "test1234",
            });
            await user.save();

            // generate auth token for the user
            token = user.generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/edit")
                    .set("x-auth-token", token)
                    .send({ username: "edited_user", password: "test1234" });
            };

            // try to edit the user
            const res = await exec();

            // search for the created user in the db
            const edited_user = await User.findById(user._id);

            expect(res.status).toBe(200);
            expect(edited_user.username).toBe("edited_user");
        });
    });

    /**
     * These test the /api/users/change_password -> POST route
     *
     * Three test cases
     * 1. test if req body is invalid
     * 2. test if user does not exists
     * 3. test if the password is changed
     */
    describe("POST /change_password", () => {
        test("should return status 400 if req body is invalid", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/change_password")
                    .set("x-auth-token", token)
                    .send({ name: "test_user" });
            };

            // try to create the user with invalid schema
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should return status 400 if user does not exists", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/change_password")
                    .set("x-auth-token", token)
                    .send({ username: "test_user", password: "test1234" });
            };

            // try to edit a user that does not exist
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should edit a user password successfully", async () => {
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("test1234", salt);

            // create an identical user
            const user = new User({
                username: "test_user",
                password: hashedPassword,
            });
            await user.save();

            // generate auth token for the user
            token = user.generateAuthToken();

            const new_pass = "changed";

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/change_password")
                    .set("x-auth-token", token)
                    .send({
                        username: "test_user",
                        password: new_pass,
                    });
            };

            // try to edit the user
            const res = await exec();

            // search for the user in the db
            const edited_user = await User.findById(user._id);

            // checking if password is correct
            const validatePassword = await bcrypt.compare(
                new_pass,
                edited_user.password
            );

            expect(res.status).toBe(200);
            expect(validatePassword).toBe(true);
        });
    });

    /**
     * These test the /api/users/delete -> POST route
     *
     * Three test cases
     * 1. test if req body is invalid
     * 2. test if user does not exists
     * 3. test if the user is edited
     */
    describe("POST /delete", () => {
        test("should return status 400 if req body is invalid", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/delete")
                    .set("x-auth-token", token)
                    .send({ name: "test_user" });
            };

            // try to create the user with invalid schema
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should return status 400 if user does not exists", async () => {
            // get a random auth token
            token = new User().generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/delete")
                    .set("x-auth-token", token)
                    .send({ username: "test_user", password: "test1234" });
            };

            // try to edit a user that does not exist
            const res = await exec();

            expect(res.status).toBe(400);
        });

        test("should delete a user successfully", async () => {
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("test1234", salt);

            // create an identical user
            const user = new User({
                username: "test_user",
                password: hashedPassword,
            });
            await user.save();

            // generate auth token for the user
            token = user.generateAuthToken();

            // expected correct request
            const exec = async () => {
                return await request(server)
                    .post("/api/users/delete")
                    .set("x-auth-token", token)
                    .send({
                        username: "test_user",
                        password: "test1234",
                    });
            };

            // try to edit the user
            const res = await exec();

            // search for the user in the db
            const deleted_user = await User.findById(user._id);

            expect(res.status).toBe(200);
            expect(deleted_user).toBeFalsy();
        });
    });
});
