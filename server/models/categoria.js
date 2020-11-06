const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// Aplica el pluggin uniqueValidator al esquema categoriaSchema.
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser única' });
module.exports = mongoose.model('Categoria', categoriaSchema);