const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const User = require("../models/user.models");
const constant = require("../utils/constants");

const verifyToken = (req, res, next) => {
    
    /**
     *  
     */
    const token = req.headers["x-access-token"]
    /**
     * Check if the token is present
     */
    if(!token){
        return res.status(403).send({
            message : "No token provided ! Access Denied"
        })
    }
    /**
     * Go and Validate the Token
     */
    jwt.verify(token,authConfig.secret, (err, decoded) =>{
            if(err){
                return res.status(401).send({
                    message : "Unauthorized !"
                });
            }

            req.userid = decoded.id ;
            next(); 
    })
    /**
     * Read the value of the token if and set it in the request for further size
     */

}

const isAdmin = async (req, res, next) =>
{
    const user = await User.findOne({userid : req.userid})
    if(user && user.userType == constant.userTypes.admin){
        next();
    }else{
        res.status(403).send({
            message : "Only Admin user are allowed to access this service"
        })
    }
}

const isValidUserIdInReqParam = async (req, res, next) => {
    try{
        const user = await User.find({userid : req.params.id});
        if(!user){
            return res.status(400).send({
                message : "UserId passed doesn't exist"
            })
        }
        next();
    }catch(err){
        console.log("Error while reading the user info ", err.message);
        return res.status(500).send({
            message : "Internal server error while reading the user data"
        })
    }
}

const isAdminOrOwner = async (req, res, next) => {
    /**
     * Either the caller should be the ADMIN or the caller be the owner of the userID
     */
     try{
        const callingUser = await User.findOne({userid : req.params.id});
        if(callingUser.userType == constant.userTypes.admin || callingUser.userid == req.params.id){
            next();
        }else{
            res.status(403).send({
                message : "Only admin or the owner is allowed to make this call"
            })
        }
    }catch(err){
        console.log("Error While reading the user info ", err.message);
        res.status(500).send({
            message : "Internal server error while reading the data"
        })
        }
    }


const authjwt = {
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    isAdminOrOwner : isAdminOrOwner,
    isValidUserIdInReqParam : isValidUserIdInReqParam,

}

module.exports = authjwt;