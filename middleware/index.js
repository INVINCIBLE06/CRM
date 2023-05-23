const verifySignUp = require("./verifySignUp");
const authjwt = require("./auth.jwt");
const validateTicket = require("./ticketValidator");
/**
 * We can add more middlewares here as the project grows
 */

module.exports = {
    verifySignUp,
    authjwt,
    validateTicket   
}