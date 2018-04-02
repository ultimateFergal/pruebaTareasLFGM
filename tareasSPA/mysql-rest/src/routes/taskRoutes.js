//framework de Node
const express = require('express');

//Para definir rutas del servidor
const router = express.Router()

//Para autenticación con Jason Web Token
const jwt = require('jsonwebtoken');
//import * as jwt from 'jsonwebtoken';

//Para funcionamiento de la app con otro dominio o puerto
const cors = require('cors');


const bodyParser = require('body-parser');
//import * as bodyParser from 'body-parser';

//Ruta inicial de servidor que ejecuta manejador de peticiones
router.get('/', (req, res) => {
    res.json([])
})

module.exports = router;

const Task = require('../models/task')




//AUTENTICACIÓN

//Llave de encriptación secreta
const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ58Ubt8-';

const validatePayLoadMiddleware = (req, res, next) => {
    if (req.body) {
        next();
    } else {
        res.status(403).send({
            errorMessage: 'No se han ingresado las credenciales'
        });
    }
}


//Se exporta módulo app previamente definido en express como app
module.exports = function (app) {
    //Ruta inicial de servidor que ejecuta manejador de peticiones
    //app.get('/', (req, res) => {
    app.get('/tasks', (req, res) => {
        //res.json([])        
        Task.getTasks((err, data) => {
            res.status(200).json(data);
        })
    })

    app.get('/task/:id/', (req, res) => {console.log("h11")
        //res.json([])
        const taskData = {
            id: req.params.id,
        }; 

        Task.getTask(taskData, (err, data) => {            
            if(data && data.msg === 'found' ){
                res.status(200).json(data);
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    })

    app.post('/tasks', (req, res) => {
        //console.log(req.body)
        const taskData = {
            id: null, 
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            dueDate: req.body.dueDate,
        };

        Taks.insertTask(taskData, (err, data) => {//Callback que puede tener error o datos
            if(data && data.msg != 'task exists'){
                if(data.insertId ){
                    res.json({
                        success: true,
                        msg: 'Task created',
                        data: data
                    })
                } else {
                    res.status(500).json({
                        success: false,
                        msg: 'Error'
                    })
                }
            } else {
                console.log(data);
                res.status(500).json({
                    success: false,
                    msg: 'Task exists'
                })
            }
        })
    })

    app.put('/tasks/:id', (req, res) => {    
        //console.log(req.body)
        const taskData = {
            id: null, 
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            dueDate: req.body.dueDate,
        };

        Task.updateTask(taskData, (err, data) => {//Callback que puede tener error o datos`
        //console.log(data)
            if(data && data.msg){
                res.json({
                    success: true,
                    msg: 'Task updated',
                    data: data
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    })

    app.delete('/tasks/:id', (req, res) => {    
        //console.log(req.body)

        Task.deleteTask(req.params.id, (err, data) => {//Callback que puede tener error o datos`
        //console.log(data)
            if(data && data.msg === 'deleted' || data.msg === 'not exists'){
                res.json({
                    success: true,
                    msg: 'Task deleted',
                    data: data
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    })

    
//AUTENTICACIÓN

//Loggeo de usuario
app.post('/user/login', (req, res) => {

    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    
  if (req.body) {
    //const task = userData[req.body.email];
    const user = userData.email;
    User.getUser(userData, (err, data) => {            
        if(data && data.msg === 'found' ){
            //res.status(200).json(data);     
            console.log(user); 
            if (data.row[0].password === req.body.password) {
                const userWithoutPassword = {...user};
                delete userWithoutPassword.pw;
                const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
                res.status(200).send({
                    user: userWithoutPassword,
                    token: token
                });
            } else {
                res.status(403).send({
                    errorMessage: 'Permiso denegado!'
                });
            }
        } else {
            res.status(500).json({
                success: false,
                msg: 'Not Exists',
                data
            })
        }
    })
    } else {
            res.status(403).send({
            errorMessage: 'Ingrese email y contraseña'
            });
    }

});

}
