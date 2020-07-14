

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    }, 
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'el password es necesario']
    },

    img: {
        type: String,
        required:false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
        
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
}
);

//Funcion que no muestra el password cuando se llama un usuario
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
//Mensaje de propiedad y error de duplicado
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })


//nombre final del schema
module.exports = mongoose.model('Usuario', usuarioSchema)