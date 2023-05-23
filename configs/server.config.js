require('dotenv').config();
// Read the key value defined inside the .env file

// It will go insert inside the process.env object

// Read from the .env and export the port no to all the files.

module.exports = {
    PORT : process.env.PORT
}