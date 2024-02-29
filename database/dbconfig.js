const dotenv = require('dotenv').config();

const dbconfig = {
    user: process.env.ORACLEDB_USER,
    password: process.env.ORACLEDB_PASSWORD,
    connectString: process.env.ORACLEDB_CONNECTSTRING,
}

module.exports = dbconfig;