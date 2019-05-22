const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    dbName: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    port: process.env.PORT
};