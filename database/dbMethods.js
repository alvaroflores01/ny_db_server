const oracledb = require('oracledb');
const dbconfig = require('./dbconfig.js');

class db {
    static async singleInsert(sqlString, tableName) {
        // let connection = await dbtest()
        // connection.close();
    }

    static async query(sql) {
        try {
            let connection = await oracledb.getConnection(dbconfig);
            result = await connection.execute(sql);
            connection.close();
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async batchQuery(sqlArray) {
        try {
            let connection = await oracledb.getConnection(dbconfig);
            results = []
            for (let i = 0; i < sqlArray.length; i++) {
                let res = await connection.execute(sqlArray[i]);
                results.push(res);
            }
            connection.close();
            return results;
        } catch (err) {
            throw err;
        }
    }

    static async getTable(select, tableName) {
        try {
            let connection = await oracledb.getConnection(dbconfig);
            const result = await connection.execute(
                `SELECT ${select} FROM "AFLORES39".${tableName}`
                // `SELECT * FROM "SAMUEL.CLARK".jobs`
                // `SELECT * FROM "SAMUEL.CLARK".jobs`
                );
            console.log(result.rows.length); 
            connection.close();
            return result;
        } catch (err) {
            throw err;
        }

    }

    static async testConnection() {
        let connection;
        try {
            connection = await oracledb.getConnection(dbconfig);
            console.log('SUCCESS: Connected to Oracle');
            connection.close();
        } catch (err) {
            throw err;
        }
    }
} 

module.exports = db;