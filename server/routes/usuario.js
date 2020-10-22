const express = require('express');
const Usuario = require('../models/usuario');

const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const bodyParser = require('body-parser');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


app.get('/usuario', verificaToken, (req, res) => {

    //parametros opcionales caen en query y asumimos que viene una variable desde = el valor ej. ( {{url}}/usuario?desde=10 )
    //para enviar parametros opcionales en la url se coloca al final signo de interrogacion nombre del parametro
    //si se desean agregar paramtros se usa el ampers ejemplo ( {{url}}/usuario?desde=10&limite=10 )
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });

        });
});



//generalmente para crear
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    //el body se obtiene del middle bodyParser
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    //funcion pick de underscore.js permite obtener unicamente las propiedades que se pasan en el array de un objeto
    //utilidad la peticion que viene del front podria enviarnos elementos que no queremos actualizar por ende con esto solo tomamos en cuenta los que permitimos en el array
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let id = req.params.id;

    //findByIdAndUpdate recibe un terver parametro options que es un objeto donde definimos el valor de ciertas propiedades propias de la funcion
    //la propiedad new: true realiza que el json de respuesta sea el objeto despues de realizar el update y no el objeto anterior en bd
    //runValidators: true corre las validaciones de nuestro modelo en cuestion en este caso Usuario. ejemplo que se usen roles validos
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarioDB
        });
    });

});



app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let desactivarEstado = { estado: false };
    //Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, desactivarEstado, { new: true }, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioEliminado
        });

    });
});



module.exports = app;