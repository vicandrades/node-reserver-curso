require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

/**************** bodyparser se usa para obtener el body de las peticiones */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public para que sea accedida desde cualquier lugar
//path.resolve recibe segmentos de path y los va armando
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion Global de rutas
app.use(require('./routes/index'));

// conexion a bd con MONGOOSE
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto:`, process.env.PORT);
});