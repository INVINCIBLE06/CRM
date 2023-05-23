/**
 * This file should have the logic to create the controller for Ticket resource
 */

// const constants = require("../utils/constants")
const constant = require("../utils/constants");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.models");
const constants = require("../utils/constants");
const sendNotificationReq = require("../utils/notificationClient");

/**
 * Method to create the logic of creaating tickets
 * 
 *  1. Any Authenticate user(customer, engineer, admin) should be able to create the ticket
 *          --- Middleware should take care of this
 * 
 *  2. Ensure that request body has valid data
 *          -- Middleware should take care of this 
 * 
 *  3. After the ticket is created, ensure the customer and Engineer document also updated
 * 
 *  4. Send the email after the tickets created to all the stake holders
 */
exports.createTicket = async (req, res) => {
    try
    {
    /**
     * Read from the request body can create the ticket objects
    */
    const ticketObj = {
        
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.userid // I got it from access token
    }
    /**
     * Find the Engineer available and attach to the ticket object
     */
    const engineer = await User.findOne({
        userType : constant.userTypes.engineer,
        userStatus : constant.userStatus.approved
    });

    /**
    * Assignment : Extend the code to choose the Engineer, Which has the leaast number of ticket available
    */

    if(engineer){
        ticketObj.assignee = engineer.userid;
    }

    /**
     * Insert the ticket object
     *      -- Insert that ticketid in customer and engineer document
     */

    const ticketCreated = await Ticket.create(ticketObj);

    if (ticketCreated){
        // Update the Customer document
        const customer = await User.findOne({
            userid : req.userid
        });

        customer.ticketsCreated.push(ticketCreated._id);
            await customer.save()

        // Update the Engineer document
        if (engineer) {
            engineer.ticketsAssigned.push(ticketCreated._id);
            await engineer.save();
        }

        // Now we should send the notification request to notificationService
        /**
         * Enrich the content of the email cotent
         */
        sendNotificationReq(`Ticket created with id : ${ticketCreated._id}`,"YaY ! Movie Ticket has been Booked",`${customer.email},${engineer.email},sp832154@gmail.com`, "CRM APP");

        res.status(201).send(ticketCreated);
    }

}catch(err){
    console.log("Error while doing the DB operations", err.message);
    res.status(500).send({
        message : "Internal Server Error"
    })
}

}

/**
 * Getting all the tickets
 */

 exports.getAllTickets = async(req, res) => {
    /**
     * We need to find the usertype
     * and depending on the user type we need to frame the search query
     */

    const user = await User.findOne({userid : req.userid});
    const queryObj = {};
    const ticketsCreated = user.ticketsCreated; // This ia an array of ticket id
    const ticketsAssigned = user.ticketsAssigned;
    
    if(user.userType == constants.userTypes.customer){
        /**
         * Query object for fetchig all the ticket assigned / created to a user
         */
          // This is an array of ticket _id
        if(!ticketsCreated){
            return res.status(200).send({
                message : "No Ticket created by the user yet"
            });
        };

        queryObj["_id"] = { $in: ticketsCreated};
         
    }else if( user.userType == constants.userTypes.engineer){
        /**
         * Query object for fetching all the ticket assigned / fcreated to a engineer
         */
        queryObj["$or"] = [{"_id": { $in: ticketsCreated}}, {"_id": {$in: ticketsAssigned}}];

        console.log(queryObj);
 }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(tickets);
}

/**
 * Write the controller function to take care of updates
 */
 exports.updateTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findOne({ "_id": req.params.id });

        /**
         * Update this ticket object based on the request body
         * passed
         */

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;


        const updatedTicket = await ticket.save();

        res.status(200).send(updatedTicket);
    
    } catch (err) {
        console.log("Some error while updating ticket ", err.message);
        res.status(500).send({
            message: "Some internal error while updating the ticket"
        })
    }
}

/**
 * 
 */