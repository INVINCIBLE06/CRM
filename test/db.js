const mongoose = require("mongoes");
const {MongoMemoryServer} = require("mongodb-memory-server");

/**
 * Connecting the database
 */
module.exports.connect = async () =>
{
    if(!mongod)
    {
        mongod = await MongoMemoryServer.create(); // this will create a running mongo server
        const uri = mongod.getUri();
        const mongooseOpts = {
            useUnifiedTopology : true,
            maxPoolSize : 10
        }
        mongoose.connect(uri, mongooseOpts); // mongoose is now connected to the daatabase
    }
}

/**
 * Disconnecting the database and closing all the connections
 */
module.exports.closeDatabase = async () =>
{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod)
    {
        await mongod.stop();
    }
}

/**
 * Clear the database, removing all the record after the testing is completed
 * 
 * When each individual test is completed
 */

module.exports.clearDatabase = () =>
{
    const collections = mongoose.connection.collections;
    for(const key in collections)
    {
        const collections = collections[key];
        collections.deleteMany(); // This will be deleting all the records from the database.   
    } 
}