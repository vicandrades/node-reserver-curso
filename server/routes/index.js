const express = require('express');
const categoria = require('../models/categoria');
const app = express();
/* Archivo de rutas, llamado a los documentos donde se encuentran las rutas */

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto.js'));
app.use(require('./uploads.js'));
app.use(require('./imagenes.js'));



module.exports = app;