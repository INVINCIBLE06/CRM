const mongoose = require('mongoose');
const constant = require('../utils/constants');

const userSchema =  new mongoose.Schema
({
        name : {
            type : String,
            required : true
        },

        userId : {
            type : String,
            required : true,
            unique : true
        },

        password : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true,
            unquie : true,
            lowercase : true,
            minlength : 10,
        },

        createdAt : {
            type : Date,
            immutable : true,
            default : () =>
                {
                    return Date.now()
                }
        },

        updatedAt : 
        {
            type : Date,
            default : () =>
            {
                return Date.now();
            }
        },
        
        userType : {
            type : String,
            required : true,
            default : constant.userTypes.customer,
            enum : [constant.userTypes.customer, constant.userTypes.engineer, constant.userTypes.admin]
        },
    
        userStatus : {
            type : String,
            required : true,
            default : constant.userStatus.approved,
            enum : [constant.userStatus.approved,constant.userStatus.pending, constant.userStatus.rejected]
        },

        ticketsCreated : {
            type : [mongoose.SchemaTypes.ObjectId],
            ref : "Ticket"
        },

        ticketsAssigned : {
            type : [mongoose.SchemaTypes.ObjectId],
            ref : "Ticket"
        }
});

module.exports = mongoose.model("user", userSchema)