/**
 * This file is going to contain all the logic for the integration testing of the
 * user.route.test.js
 */
const db = require("../db");
const jwt = require("jsonwebtoken");
const config = require('../../configs/auth.config');
const request = require('supertest');
const app = require('../../server')
const User = require('../../models/user.models');
/**
 * This will be used to do the initial setup of the project
 */
let token;
beforeAll(async ()=>
{
    // Generating the own custome token to be used for sending the request for authenticatiion
    const token = jwt.sign({id : "saur01"}, config.secret,
    {
        expiresIn : 120
    });
    /**
     * Inserting the data inside the database
     */
    await db.clearDatabase();
    await userModels.create
    ({
        name : "Saurabh",
        userId : "saur01",
        email : "sp832154@gmail.com",
        userType : "ADMIN",
        password : "Welcome1",
        userStatus : "Approved"       
    });
    
});

/**
 * Cleanup of the project when everything is completed
 */
afterAll( async ()=>
{
     await db.closeDatabase();
});
/**
 * Intergration testing for all the users endpoint /crm/api/v1/user
 */

describe("Find all the users", async () =>
{
    it("Find all the users", async () =>
    {
        /**
         * 1. We need to have some data in the test database. || Doe in the beforeAll method
         * 2. Generate the token using the same logic and use for the test
         */
        
        // Need to invoke the api -- we need to make use of supertest

        const res = await request(app).get("/crm/api/v1/users").set("x-access-token", token);

        // Code for the validation 

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "name" : "Saurabh",
                    "userId" : "saur01",
                    "email" : "sp832154@gmail.com",
                    "userType" : "ADMIN",
                    "userStatus" : "Approved"  
                })
            ])
        )
    });
});

describe("Find user based in userId", () =>
{
    it("test the endpoint /crm/api/v1/users/:id", async () =>
    {
        const res = await request(app).get("/crm/api/v1/users/saur01").set("x-access-token", token);
        //Validation of the code
        expect(res.statusCode).toEqual(200);

        expect(res.body).toEqual
        (
            expect.arrayContaining
            ([
                expect.objectContaining
                ({
                    "name" : "Saurabh",
                    "userId" : "saur01",
                    "email" : "sp832154@gmail.com",
                    "userType" : "ADMIN",
                    "userStatus" : "Approved"  
                })
            ])
        );
    });
});