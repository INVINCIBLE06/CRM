const mongoose = require("mongoose");
const constant = require ("../utils/constants");

const ticketSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    ticketPriority : {
        type : Number,
        required :  true,
        default : 4
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : constant.ticketStatuses.open,
        enum :  [constant.ticketStatuses.open, constant.ticketStatuses.close, constant.ticketStatuses.blocked]
    },
    reporter : {
        type : String,
        required : true
    },
    assignee : {
        type : String
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
    }
}, { versionKey : false}) // Through this we can stop the creation of version key which was by default by the mongoose

module.exports = mongoose.model("Ticket", ticketSchema);