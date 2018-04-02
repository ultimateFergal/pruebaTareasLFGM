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

const User = require('../models/user')




//AUTENTICACIÓN

//Llave de encriptación secreta
const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ58Ubt8-';


//Middleware de verificación y autenticación
const jwtMiddleware = (req, res, next) => {

    const authString = req.headers['authorization'];
    if(typeof authString === 'string' && authString.indexOf(' ') > -1){
        const authArray = authString.split(' ');
        const token = authArray[1];
        jwt.verify(token, serverJWT_Secret, (err, decoded) => {
            if (err){
                res.sendStatus(403);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.sendStatus(403)
    }
};

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

    //Ruta de método obtener usuarios
    app.get('/users', (req, res) => {
        //res.json([])        
        User.getUsers((err, data) => {
            res.status(200).json(data);
        })
    })

     //Ruta de método obtener un usuario
    app.get('/user/:em/:pw', (req, res) => {console.log("h11")
        //res.json([])
        const userData = {
            email: req.params.em,
            password: req.params.pw,
        }; 

        User.getUser(userData, (err, data) => {            
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

     //Ruta de método obtener ingresar un usuario
    app.post('/users', (req, res) => {
        console.log(req.body)
        const userData = {
            id: null, 
            email: req.body.email,
            password: req.body.password,
        };
        
        User.insertUser(userData, (err, data) => {//Callback que puede tener error o datos
            
            if(data && data.msg != 'user exists'){
                if(data.insertId ){
                    res.json({
/*                         success: true,
                        msg: 'Usuario creado', */
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
                //res.status(500).json({
                res.json({
                    success: false,
                    msg: 'Usuario existe'
                })
            }
        })
    })

    //Ruta de método actualizar un usuario
    app.put('/users/:id', (req, res) => {    
        //console.log(req.body)
        const userData = {
            id: req.params.id, 
            email: req.body.email,
            password: req.body.password,
        };

        User.updateUser(userData, (err, data) => {//Callback que puede tener error o datos`
        //console.log(data)
            if(data && data.msg){
                res.json({
                    success: true,
                    msg: 'Usuario actualizado',
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

    //Ruta de método eliminar un usuario
    app.delete('/users/:id', (req, res) => {    
        //console.log(req.body)

        User.deleteUser(req.params.id, (err, data) => {//Callback que puede tener error o datos`
        //console.log(data)
            if(data && data.msg === 'deleted' || data.msg === 'not exists'){
                res.json({
                    success: true,
                    msg: 'Usuario borrado',
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

//////////////////////////////////////////////////////////////////////////////////////////////////    
//AUTENTICACIÓN

//Loggeo de usuario
app.post('/user/login', (req, res) => {

    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    
  if (req.body) {
    //const user = userData[req.body.email];
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
                msg: 'El usuario no existe o se ha ingresado mal la contraseña',
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

