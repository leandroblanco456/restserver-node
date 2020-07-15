// Archivo de rutas de la app

const express = require('express');
const app = express();



app.use(require('./usuario'));
app.use(require('./login'))


module.exports = app;