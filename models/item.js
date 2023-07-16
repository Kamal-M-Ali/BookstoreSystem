const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    updated_date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = Item = mongoose.model('item', ItemSchema);