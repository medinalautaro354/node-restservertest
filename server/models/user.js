const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido.'
}
let Schema = mongoose.Schema;

let user = new Schema({
    name:{
        type: String,
        require: [true,'El nombre es necesario']
    },
    email:{
        type: String,
        require: [true, 'El correo es necesario'],
        unique: true
    },
    password:{
        type: String,
        require:[true, 'La contraseña es obligatoria']
    },
    image:{
        type: String,
        require: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    IsActive: {
        type: Boolean,
        default: true,
    },
    google:{
        type: Boolean,
        default: false
    }
});

user.methods.toJSON = function () {

    let user = this;
    let entity = user.toObject();
    delete entity.password;

    return entity;
}

user.plugin(uniqueValidator, {
    message:'{PATH} debe de ser unico'
});

module.exports = mongoose.model('User', user);
