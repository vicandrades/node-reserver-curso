const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();

let Producto = require('../models/producto');
const usuario = require('../models/usuario');


// =============================
//  Obtener todos los Productos 
// =============================
app.get('/productos', verificaToken, (req, res) => {
    //populate
    //paginado

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });

});

// =============================
//  Obtener Producto por Id 
// =============================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate
    let id = req.params.id;

    Producto.findById(id, 'nombre precioUni descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });

});



// =============================
//  Buscar Productos
// =============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // uso de expresion regular
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });
        });
});
// =============================
//  Crear un nuevo Producto 
// =============================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// =============================
//  Actualiza Producto 
// =============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});


// =============================
//  Delete Producto 
// =============================
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;
    let desactivarDisponibilidad = { disponible: false }
    Producto.findByIdAndUpdate(id, desactivarDisponibilidad, { new: true }, (err, productoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoEliminado,
            mensaje: 'Producto Borrado'
        });

    });
});


module.exports = app;