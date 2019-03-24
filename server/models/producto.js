const mongoose = require('mongoose')

let Schema = mongoose.Schema

let ProductSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'el nombre es requerido']
    },
    precioUnit: {
        type: Number,
        required: [true, 'el precio unitario es requerido']
    },
    descripcion:{
        type: String,
        required: false
    },
    disponible:{
        type: Boolean,
        required: true,
        default: true
    },
    img:{
        type: String,
        default: false
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


module.exports = mongoose.model('Product',ProductSchema)