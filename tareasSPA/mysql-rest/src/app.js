//Framework de Node
const express = require('express');
const app = express(); 

//usar morgan eon coifguración de desarrollo para mostrar mensajes por consola
const morgan = require('morgan');

//Para entender las peticiones POST en forma de json en los bodies
const bodyParser = require('body-parser');


const path = require('path');

//Para funcionamiento de la app con otro dominio o puerto
const cors = require('cors');



//SETTING
app.set('port', process.env.PORT || 3000 );




//API
//Middlewares - funciones que se ejecutan cada vez que se recibe una petición
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cors());

//Routes
require('./routes/userRoutes')(app);
require('./routes/taskRoutes')(app);
app.listen(app.get('port'), () => {
    console.log('server on port 3000');
})