/**
 * This file will have the logic to validate the incoming request body
 */

const  User = require("../models/user.models");
const constant = require("../utils/constants");
// const constant = require("../utils/constants")

 validateSignUpRequestBody = async(req, res, next) =>
{
    // Validate if the name is present
    if(!req.body.name){
        return res.status(400).send({
            message : "Failed ! User name is not provided"
        })
    }

    // Validate if the password is correct and present
    /**
     * 1. It should have alphabet and number both
     * 2. User must not enter wrong password more than 5 time consecutvely
     * 3. It should be a minimum lemgth 10
     */
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed ! Password is not provided"
        })
    }

    // Validate if the userid is present, and it's and not duplicate
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed Userid is not provided"
        })
    }
    try{
        const user = await User.findOne({userId : req.body.userId});
        if(user != null){
            return res.status(400).send({
                message : "Failed ! UserId is already taken"
            })
        }
    }catch(err){
        return res.status(500).send({
            message : "Internal server error while validating the request"
        })

    }
    
    // Validate if the emailid is present, is valid and not duplicate
    if(!req.body.email){
        return res.status(400).send({
            message : "Failed : Email is not provided or available"
        })
    }

    if(!isValidEmail(req.body.email)){
        return res.status(400).send({
            message : "Failed ! Not a valid emailid"
        })
    }

    // Validate if the userType is present

    if(!req.body.userType){
        return res.status(400).send({
            message : "Failed ! userType is not passed"
        })
    }
    
    /**
     * This is written to bar the user to be signup as a ADMIN
     */

    if(req.body.userType == constant.userTypes.admin){
        return res.status(400).send({
            message : "ADMIN registration is not allowed"
        })
    }

    /** 
     * this function is validating and recitify the role to assigned to the user and grantinng access
     */

    const userType = [constant.userTypes.engineer, constant.userTypes.customer];

    if(!userType.includes(req.body.userType)){
        return res.status(400).send({
            message : "UserType provided is not correct. Possible correct values : CUSTOMER | ADMIN | ENGINEER"
        })
    }
    next(); // Give control to the next middleware or controller 
}
    /**
     * This functon is written for validation the schema or criteria that a emailid must be in.
     */
 const isValidEmail = (email) =>
 {
     return String(email).toLowerCase().match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
 }
    

validateSignInRequestBody = async(req, res, next) => {
    // Validate if the userid is present
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed Userid is not provided"
        })
    }

    if(!req.body.password){
        return res.status(400).send({
            message : "Failed ! Password is not provided"
        })
    }

    next();
}
const verifyRequestBodiesForAuth = {
    validateSignInRequestBody : validateSignInRequestBody,
    validateSignUpRequestBody : validateSignUpRequestBody
}

module.exports = verifyRequestBodiesForAuth