const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    invoiceID: {
        type: String,
        require: true,
    },
    workHours : {
        type: String,
        require: true,
    },
    expenses: {
        type: String,
        require: true,
    },
    labour: {
        type: String,
        require: true,
    },
    notes: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    due: {
        type: String,
        require: true,
    }
}, {timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;