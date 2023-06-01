const User = require('./models/user.models')
const Ticket = require('./models/ticket.model')
const bcrypt = require('bcryptjs')
const constants = require('./utils/constants')

module.exports = async ()=>
{
    try
    {
        await User.collection.drop();
        console.log("#### User collection dropped ####");
        await Ticket.collection.drop();
        console.log("#### Ticket collection dropped ####");

        const user = await User.findOne
        ({
            userId : "admin"
        });

        if(user)
        {
            console.log("#### ADMIN user is already present ####");
            return;
        }
        else
        {
            const user = await User.create
            ({
                name : "Saurabh Pande",
                userId : "saur01",
                password : bcrypt.hashSync("itsonlySaurabh@9",8),
                email : "sp832154@gmail.com",
                userType : constants.userTypes.admin,
                emailVerified : true
            });
            console.log("#### Admin user created ####");
        }
    }
    catch(err)
    {
        console.log("#### Error in DB initialization #### ", err.message);
    }
}