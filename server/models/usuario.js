const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let roles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'el nombre es requerido']
    },
    email: {
        type: String,
        required: [true,'el correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe ser unico'
} )


usuarioSchema.methods.toJSON = function () {
    let Object = this.toObject();
    delete Object.password
    return Object
}



module.exports = mongoose.model('Usuario', usuarioSchema);