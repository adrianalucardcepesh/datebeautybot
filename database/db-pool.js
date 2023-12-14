const mariadb = require('mariadb');
const dbConfig = require('./db-config.js');

async function getConnection() {
    const pool = mariadb.createPool({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    });

    return await pool.getConnection();
}

module.exports = {
    getConnection
};