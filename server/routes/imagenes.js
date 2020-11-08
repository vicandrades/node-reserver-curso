const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;

    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    //lee el content type del archivo y es lo que envia
    //res.sendFile(noImagePath);

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    fs.existsSync(pathImagen) ? res.sendFile(pathImagen) : res.sendFile(noImagePath);

});

module.exports = app;