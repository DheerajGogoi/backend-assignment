const router = require('express').Router();
// const validate = require('express-validation');
const Invoice = require('../models/invoice.model');
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
// const { postInvoices } = require('./validation');
const { body, validationResult } = require('express-validator'); 


router.route('/all').get( async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.route('/add').post( [
    body('name')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({min: 3})
        .withMessage('Name must be atleast 5 characters long'),
    body('workHours')
        .notEmpty()
        .withMessage('Work hours cannot be empty'),
    body('expenses')
        .notEmpty()
        .withMessage('Expenses cannot be empty'),
    body('labour')
        .notEmpty()
        .withMessage('Labour cannot be empty'),
    body('notes')
        .notEmpty()
        .withMessage('Notes cannot be empty'),
    body('status')
        .notEmpty()
        .withMessage('Invoice status cannot be empty'),
    body('due')
        .notEmpty()
        .withMessage('Payment due date cannot be empty'),
], async (req, res) => {

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        function generateID() {
            var pass = '';
            var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (i = 1; i <= 5; i++) {
                var char = Math.floor(Math.random()*str.length + 1);
                pass += str.charAt(char)
            }
              
            return pass;
        }
        const newInvoice = new Invoice({
            name: req.body.name,
            workHours: req.body.workHours+' per week',
            invoiceID: 'In#'+generateID(),
            expenses: 'Rs. '+req.body.expenses,
            labour: req.body.labour,
            notes: req.body.notes,
            status: req.body.status,
            due: req.body.due,
        })
        const invoice = await newInvoice.save();
        res.status(200).json(invoice);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/find/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const invoice = await Invoice.findOne({ _id: req.params.id });
        !invoice && res.status(404).json("invoice not found");

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/view/late', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        var lateInvoices = [];
        for(let i=0;i<invoices.length;i++){
            var today = new Date()
            var dueDate = new Date(invoices[i].due);
            console.log('Today', today.toDateString(), 'Due', invoices[i].due)
            if(today > dueDate && today.toDateString() !== invoices[i].due && invoices[i].status !== 'paid') {
                lateInvoices.push(invoices[i]);
            }
        }
        res.status(200).json(lateInvoices);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.route('/update/status/:id/:statusType').put(async(req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate( req.params.id, { status: req.params.statusType }, {new: true});
        !updatedInvoice && res.status(200).json(updatedInvoice);

        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.route('/send/mail/:id').get(async(req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id });
        !invoice && res.status(404).json("invoice not found");

        let transporter = nodemailer.createTransport({
            service: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERID,
                pass: process.env.GMAIL_PASS
            }
        });
    
        let info = await transporter.sendMail({
            from: '"Fred Foo" <foo@example.com>',
            to: "1fdljckjnq@email.edu.pl",
            subject: "Hello",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });
        console.log("Message sent: %s", info.messageId);

        res.status(200).json('Email Sent');
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;