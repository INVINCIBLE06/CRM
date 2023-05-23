
/**
 * Route logic for the ticket resource
 */
const ticketController = require("../controllers/ticket.controller");
const {authjwt, validateTicket} = require('../middleware')
module.exports = (app) => {
    
    /**
     * Create a ticket
     * 
     * Post /crm/api/v1/tickets
     * 
     * Assignment the middlewaare for the validation for the request body
     */
    
    app.post("/crm/api/v1/tickets/", [authjwt.verifyToken], ticketController.createTicket);

    /**
     * GET /crm/api/v1/tickets
     */

    app.get("/crm/api/v1/tickets/", [authjwt.verifyToken], ticketController.getAllTickets);

    /**
     * PUT /crm/api/v1/tickets/:id
     */

    app.put("/crm/api/v1/tickets/:id", [authjwt.verifyToken, validateTicket.isValidOwnerOfTheTicket], ticketController.updateTicket);


}
