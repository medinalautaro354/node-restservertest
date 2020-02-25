const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: { type: String, require: [true, 'El nombre es necesario.'] },
    price: { type: Number, require: [true, 'El precio es necesario.'] },
    description: { type: String, require: false },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);