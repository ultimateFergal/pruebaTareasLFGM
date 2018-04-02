/* //Conecta a la base de datos y define algunos métodos
const mysql = require('mysql');

connection = mysql.createConnection({
    host: 'localhost',
    task: 'root',
    password: 'root',
    database: 'lfgmapidb'
}); */

const connection = require('../config/dbconnection')

let taskModel = {};

taskModel.getTasks = (callback) => {
    if (connection) {//Devuelve con callback con error o filas
        connection.query(
            'SELECT * FROM tasks ORDER BY id', 
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

taskModel.getTask = (taskData, callback) => {//taskData es datos a ingresar
    
    if (connection) {
        let sql = `
            SELECT * FROM tasks 
            WHERE id = ${connection.escape(taskData.id)} 
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

taskModel.insertTask = (taskData, callback) => {//taskData es datos a ingresar
    if (connection) {
        let sql = `
            SELECT * FROM tasks WHERE id = ${connection.escape(taskData.id)}
        `;

        connection.query(sql, (err, row) => {
                if (row.length > 0) {
                    callback(null, {//Envía null como error y el resultado de la transacción en la bd
                        "msg": "task exists",
                        "row": row
                    })
                } else{
                    console.log(row);
                    connection.query(
                        'INSERT INTO tasks SET ?',  taskData,
                        (err, result) => {
                            if (err) {
                                throw err;
                            } else{
                                callback(null, {//Envía null como error y el resultado de la transacción en la bd
                                    "insertId": result.insertId,
                                    "msg" : "task created"
                                })
                            }
                        }
                    )
                }
            }
        )
    }
}


taskModel.updateTask = (taskData, callback) => {//taskData es datos a ingresar
    if (connection) {

        const sql = `
            UPDATE tasks SET 
            title = ${connection.escape(taskData.taskname)} 
            status = ${connection.escape(taskData.taskname)} 
            description = ${connection.escape(taskData.taskname)} 
            dueDate = ${connection.escape(taskData.taskname)} 
            WHERE  id = ${connection.escape(taskData.id)}

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

taskModel.deleteTask = (id, callback) => {
    if (connection) {
        let sql = `
            SELECT * FROM tasks WHERE id = ${connection.escape(id)}
        `;

        connection.query(sql, (err, row) => {
                if (row) {
                    let sql = `
                        DELETE FROM tasks WHERE id = ${id}
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

module.exports = taskModel;