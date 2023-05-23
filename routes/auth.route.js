/**
 * This fle will conatin the logic for routing request
 * 
 * This file is dedicated to the routing logic for sigup and sigin
 */

const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware"); // This is calleed object destructuring
module.exports = (app) => {
    /**
     * Signup
     * POST --> /crm/api/v1/auth/signup
     */

    app.post("/crm/api/v1/auth/signup", [verifySignUp.validateSignUpRequestBody], authController.signup);

    /**
     * Signin
     * Login 
     * POST --> /crm/api/v1/auth/signup 
     */
    app.post("/crm/api/v1/auth/signin", [verifySignUp.validateSignInRequestBody], authController.signin);

    
}