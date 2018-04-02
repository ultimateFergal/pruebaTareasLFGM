/* //Conecta a la base de datos y define algunos métodos
const mysql = require('mysql');

connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lfgmapidb'
}); */

const connection = require('../config/dbconnection')

let userModel = {};

userModel.getUsers = (callback) => {
    if (connection) {//Devuelve con callback con error o filas
        connection.query(
            'SELECT * FROM users ORDER BY id', 
            (err, rows) => {
                if (err) {
                    throw err;
                } else{//Envía null como error y las filas
                    callback(null, rows)
                }
            }
        )
    }
};

userModel.getUser = (userData, callback) => {//userData es datos a ingresar
    
    if (connection) {
        let sql = `
            SELECT * FROM users 
            WHERE email = ${connection.escape(userData.email)} 
            AND password = ${connection.escape(userData.password)}
        `;
        
        connection.query(sql, (err, row) => { 
                if (err){ 
                    throw err;
                } else {  
                    if (row.length > 0) { console.log("h5");console.log(row);
                        callback(null, {//Envía null como error y el resultado de la transacción en la bd
                            "msg": "found",
                            "row": row
                        })
                    } else{ 
                        callback(null, {//Envía null como error y el resultado de la transacción en la bd
                            "msg": "not exists"
                        })
                    }
                }
            }
        )
    }
}

userModel.insertUser = (userData, callback) => {//userData es datos a ingresar
    if (connection) {
        let sql = `
            SELECT * FROM users WHERE email = ${connection.escape(userData.email)}
        `;

        connection.query(sql, (err, row) => {
                if (row.length > 0) {
                    callback(null, {//Envía null como error y el resultado de la transacción en la bd
                        "msg": "user exists",
                        "row": row
                    })
                } else{
                    console.log(row);
                    connection.query(
                        'INSERT INTO users SET ?',  userData,
                        (err, result) => {
                            if (err) {
                                throw err;
                            } else{
                                callback(null, {//Envía null como error y el resultado de la transacción en la bd
                                    "insertId": result.insertId,
                                    "msg" : "user created"
                                })
                            }
                        }
                    )
                }
            }
        )
    }
}


userModel.updateUser = (userData, callback) => {//userData es datos a ingresar
    if (connection) {

        const sql = `
            UPDATE users SET 
            email = ${connection.escape(userData.email)}, 
            password = ${connection.escape(userData.password)} 
            WHERE  id = ${connection.escape(userData.id)}

        `
        
        connection.query(sql, (err, result) => {
                if (err) {
                    throw err;
                } else{
                    callback(null, {//Envía null como error y el resultado de la transacción en la bd
                        "msg": "success"
                    })
                }
            }
        )
    }
}

userModel.deleteUser = (id, callback) => {
    if (connection) {
        let sql = `
            SELECT * FROM users WHERE id = ${connection.escape(id)}
        `;

        connection.query(sql, (err, row) => {
                if (row) {
                    let sql = `
                        DELETE FROM users WHERE id = ${id}
                    `;
                    connection.query(sql, (err, resul) => {
                        if (err) {
                            throw err;
                        } else {
                            callback(null, {
                                msg: 'deleted'
                            })
                        }
                    })
                } else{
                    callback(null, {//Envía null como error y el resultado de la transacción en la bd
                        "msg": "not exists"
                    })
                }
            }
        )
    }
}

module.exports = userModel;