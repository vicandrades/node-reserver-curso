const express = require('express');
const app = express();
/* Archivo de rutas, llamado a los documentos donde se encuentran las rutas */

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;