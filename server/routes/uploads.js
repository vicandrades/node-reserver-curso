const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//middleware al usar esta funcion todo lo que se cargue o se suba caera en la ruta req.files, se pueden agregar mas configuraciones al fileUpload
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //valida tipos a los que se le puede cargar imagenes usuarios, producto etc
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                //retorna un string de todos los valores de un array separados por un caracter especificado
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        });
    }

    // El nombre del imput file de ejemplo es (i.e. "sampleFile"), pero se puede modificar sin problemas 
    let archivo = req.files.archivo;

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreSplit = archivo.name.split('.');

    let extension = nombreSplit[nombreSplit.length - 1];

    //indexOf permite buscar dentro de un array y retorna la posicion de la primera ocurrencia, sino lo encuentra retorna -1
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                //retorna un string de todos los valores de un array separados por un caracter especificado
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    //se le adiciona los milisegundos para prevenir que el cache afecte el proceso
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    });
    switch (tipo) {
        case 'usuarios':
            imagenUsuario(id, res, nombreArchivo);
            break;
        case 'productos':
            imagenProducto(id, res, nombreArchivo);
        default:
            break;
    }

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        })

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });

}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen) && (pathImagen != null)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;