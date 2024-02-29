const oracledb = require('oracledb');
const dbconfig = require('./dbconfig.js');


//Quick Check if DB environment is propertly set up.
//check through localhost:xxx/testdb
async function checkConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        await connection.close()
        console.log('SUCCESS: Connected to Oracle');
    } catch (err) {
        throw err;
    } 
}
module.exports = checkConnection;