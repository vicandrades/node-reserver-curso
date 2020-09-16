require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//generalmente se consulta
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

//generalmente para crear
app.post('/usuario', function(req, res) {

    //el body se obtiene del middle bodyParser
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            response: {
                ok: false,
                mensaje: 'el nombre es necesario'
            }

        });
    } else {
        res.json({
            persona: body
        });
    }
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto:`, process.env.PORT);
});