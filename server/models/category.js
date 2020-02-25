const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name:{
        type: String,
        require: [true, 'El nombre de la categoria es necesario'],
        unique: true
    },
    isActive: {
        type:Boolean,
        default: true
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }

});

categorySchema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
});

module.exports = mongoose.model('Category', categorySchema);