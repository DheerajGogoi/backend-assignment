const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();
// const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

// MONGOOSE DB CONNECTION START
const url = process.env.DB_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connected Successfully');
});

// ROUTES START
const invoiceRouter = require('./routes/invoice')
// ROUTES END

// END POINTS START
app.use('/invoice', invoiceRouter);
// END POINTS END

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Server is running at port '+port);
})