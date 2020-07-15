

//archivos locales
 require('./config/config');


// paquetes exteriores
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');



app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));



//Conexion a mongo

mongoose.connect(process.env.URLDB,{useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true}, (error, respuesta) => {

    if ( error ) throw error;

    console.log('Base de datos online');
});

//Server up
app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto', process.env.PORT);
})