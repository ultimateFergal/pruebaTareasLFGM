//Conecta a la base de datos y define algunos métodos
const mysql = require('mysql');

/* connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lfgmapidb'
}); */

let dbConnection = {};

dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lfgmapidb'
});

module.exports = dbConnection;