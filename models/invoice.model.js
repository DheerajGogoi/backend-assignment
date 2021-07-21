const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    name: {
        type: String,
    },
    invoiceID: {
        type: String,
    },
    workHours : {
        type: String,
    },
    expenses: {
        type: String,
    },
    labour: {
        type: String,
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
    },
    due: {
        type: String,
    }
}, {timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;