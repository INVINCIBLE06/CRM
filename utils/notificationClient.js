/**
 * This file have the logic to connect to the notification service
 */

const Client = require("node-rest-client").Client;

const client = new Client(); // This is the client object which will be used calling the REST APIs

/**
 * Exposing a method which takes the request parameters for sending
 * the notification request to the notification service
 */
module.exports = (subject, content, recepients, requester) => {
   /**
    * Create the request body
    */
   const reqBody = 
    {
        subject : subject, 
        recepientEmails : recepients,
        content : content,
        requester : requester
    }
   
   /**
    * Prepare the headers
    */
   const reqHeaders = {
    "Content-Type" : "application/json"
   }

   /**
    * Combine the headers and req body together
    */
   const args = {
    data : reqBody,
    headers : reqHeaders
   }

   /**
    * Make the POST call and handle the response
    */
   try{
    client.post("http://localhost:8080/notiserv/api/v1/notification",args, (data, res) => {
        console.log("Request Sent");
        console.log(data);
    })
   }catch(err){
    console.log(err.message);
   }
}
