/**
 * This file will contain the unit testing for all the method
 * of user controllers
 * */

/**
 * Lets try to test the method findall
 * 
 * 
 *          - happy path test
 *          - test based on the query param
 *          - negative
 */
const { findAll } = require("../../controllers/user.controller");
const User = require("../../models/user.models");
const { mockRequest, mockResponse } =  require("../interceptor");
// const {mockRequest, mockResponse} =  require("../interceptor");  ---> This statement is refered to a object destructuring
// 

const userTestPayLoad = {
    name : "Test",
    userId : "Test01",
    email : "test@gmail.com",
    userType : "CUSTOMER",
    userStatus : "APPROVED",
    ticketsCreated : [],
    ticketsAssigned : [],
    // exec : jest.fn()
}

describe("test findAll method", () => 
{
    it("test the scenario when no query param is passed", async () => {
    /**
     * first we are doing the setup for the project 
     * 
     *  */
    /**
     * Mock User.find method
     */
    // spyOn is used to mock. Usually find will go into the db and do the operation. But when we use spy it will not behave like same. It will prevent going into the database
    const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayLoad]));

    // Mock req and res objects as well
    const req = mockRequest();
    const res = mockResponse();  
    res.query = {}; // We need to provide the mock implemetation 
        /**
         * Actual Execution
         */
        await findAll(req, res);
        /**
         * Assertion
         */
        // I need to verify that the userspy was called in the execution
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining
            ([
                expect.objectContaining
                ({
                    name : "Test"
                })
            ])
        )
    })
    it("Test the scenario when the user status is passed in query params ", async () => 
    {
     /**
     * Mock User.find method
     */
    const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayLoad]));
    // Mock req and res objects as well
    const req = mockRequest();
    const res = mockResponse();
    req.query = { userStatus : "APPROVED"}
    await findAll(req, res);
            // I need to verify that the userspy was called in the execution
            expect(userSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(
                expect.arrayContaining
                ([
                    expect.objectContaining
                    ({
                        userStatus : "APPROVED"
                    })
                ])
            )
    })
    /**
     * Test One negative case
     */
    it("error while calling the User.find method", async() =>
    {
        /**
         * mock the error scenario
         */
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.reject(new Error("error")));
        // mock req and res objects as well
        const req = mockRequest();
        const res = mockResponse();
        req.query = {userStatus : "APPROVED"};
        await findAll(req, res);
         // I need to verify that the userspy was called in the execution
         expect(userSpy).toHaveBeenCalled();
         expect(res.status).toHaveBeenCalledWith(500);
         expect(res.send).toHaveBeenCalledWith({
            message : "Internal Server Error"
         });
    })
});
