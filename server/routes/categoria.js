const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');

//todas deben usar el verificatoken y de alli puedes obtener los datos del usuario

// ===================================
// Mostrar todas las Categorias
// ===================================
app.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        //populate verifica que objectsId existen en la collection y cargarlos
        .populate('usuario', 'nombre email') //se especifica el objectid y los campos que se desean mostrar por defecto muestra todos
        //si existieran otras colecciones que llenar o popular simplemente se agrega otro populate
        /*.populate('ejemplo', 'ejemplo') //se especifica el objectid y los campos que se desean mostrar por defecto muestra todos */
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            });

        })
});


// ===================================
// Mostrar una categoria por ID
// ===================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById

    let id = req.params.id;
    Categoria.findById(id, 'descripcion usuario', (err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    })
});

//==================================== 
// Crear categoria
//====================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDb
        });
    });

});

//==================================== 
// Actualizar categoria
//====================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //actualizar descripcion de la categoria
    let body = req.body;
    console.log(body.descripcion);
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        })

    })

});

//==================================== 
// Eliminar categoria
//====================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admintrador puede borrar la categoria
    //categoria.findByIdAndRemove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaEliminada
        });

    })
});



module.exports = app;