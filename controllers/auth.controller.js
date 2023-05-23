/**
 * This file will contain the logic for the 
 * registration of the user and login of the user
 * 
 * User :
 * 
 * Customer 
 * 1. Registered and it is approved by default
 * 2. Should be able to login immeditately
 * 
 * Engineer
 * 
 * 1. Should be able to registered
 * 2. Intially he.she will be in PENDIING stage.
 * 3. Admin should be able to approve this.
 * 
 * Admin
 * 
 * 1. Admin user should be only created from the backend... No API should be
 *    supported it.
 * 2. it must be not be creted from user because it is a super user. 
*/

// Server is a never stoping process or always running process . which is needed to mahe an available our application to the oustide world. Which run on a particular port.

/**
 * Logic to accept the signup request.
 * req --> what we get from the client
 * res --> What we return from the server
*/
const bcrypt = require("bcryptjs");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const constant = require("../utils/constants");

exports.signup = async (req, res) => {
    /**
     * I need to read the data from the request body
     */
    if(req.body.userType != constant.userTypes.customer)
    {
        req.body.userStatus = constant.userStatus.pending;
    }
    /**
     * convert  that data into the JS object for inserting into mongodb
     */
    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        /**
         * storing the password is done with hashing with the salt
         */
        password : bcrypt.hashSync(req.body.password, 8),
        userStatus : req.body.userStatus
    };
    /**
     * Insert the data and return the response
     */
    try{
        const userCreated = await User.create(userObj);
        /**
         * we need to return the newwly created user as
         * the reponse.
         * but we should remove some sensitive feilds
         * -password
         * - __V
         * -- _id
         * 
         * we need to create the custom response and return
         */
        const response = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
        }
        res.status(201).send(response);
    }catch(err){
        console.log("Some error happened", err.message);
        res.status(500).send({
            message : "Some internal server error"
        })

    }
    
}

/**
 * Logic for signin
 */

exports.signin = async (req, res) =>{

    /**
     * if the userid passed is correct
     */
try{
    const user = await User.findOne({userId : req.body.userId});
    if(user == null)
    {
        return res.status(400).send({
            message : "Failed ! userId passed doesn't exist"
        });
    }
    /**
     * check if the user is n the pending state
     */
    if(user.userStatus == constant.userStatus.pending){
        return res.status(400).send({
            message : "Not yet Approved from the admin  "
        })
    }

    /**
     * if the user password is correct
     */
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordIsValid){
        return res.status(401).send({
            message : "Wrong password"
        });
    }

    /**
     * Create the JWT toekn
     */
    const token = jwt.sign({
        id: user.userId },
        authConfig.secret, {
            expiresIn : 36400 // This is in milliseconds
        })
    /**
     * Ssend the successful login response
     */
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken : token
    });
}catch(err){
    console.log("Internal error , " , err.message);
    res.status(500).send({
        message : "Some internal erro happened whle signin"
    });
}
}

