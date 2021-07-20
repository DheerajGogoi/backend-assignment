# Backend Assignment by Wytin
## by [Dheeraj Gogoi](mailto:dheerajgogoi2@gmail.com)

# API Documentation

on cloning the project, open a terminal in the folder and type
```
npm install
```
to install all the required dependencies

After installing all the dependencies, create a new file named **.env** in the main folder of your project and inside it add these lines
```
DB_URL=your_mongodb_url
PORT=3000
```

### Schema/Structure of the data:

> Location: /models/invoice.model.js
```
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
```
Where:
- **name** stands for the customer's name
- **invoiceID** stands for the customer's unique invoice id
- **workHours** stands for number of hours worked per week
- **expenses** stands for weekly expenses
- **labour** stands for the material labor
- **notes** stands for certain notes
- **status** stands for the status of the invoice i.e. pending, paid etc.
- **due** stands for the invoice due date

### Required routes:

> Location: /routes/invoice.js
```
router.route('/all').get( async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.route('/add').post(async (req, res) => {
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

router.route('/update/status/:id').put(async(req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate( req.params.id, { status: req.body.status }, {new: true});
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
```
The server will be running of port 3000 and hence the respective api endpooints will be like
- For vewing all invoices (get request)
```
https://localhost:3000/invoice/all
```
- For adding a new invoice (post rquest)
```
https://localhost:3000/invoice/add
```
where the object sent for post through this route should look like this:
```
{
  workHours: /*work hours*/
  expenses: /*weekly expenses*/,
  labour: /*labour*/,
  notes: /*A note example: a note for the instruction of paymeny*/,
  status: /*invoice payment status*/,
  due: /*Due date in the format --> Mon Jul 19 2021*/,
}
```
- For finding a specific invoice (get request) with **_id_** which is the id of invoice object stored in mongoDB
```
https://localhost:3000//invoice/find/:id
```
- For finding all the late invoices i.e. due invoice (get request)
```
https://localhost:3000/invoice/view/late
```
- For updating (put request) the status of invoice where **_id_** which is the id of invoice object stored in mongoDB and **:statusType** is the new status of the invoice 
```
https://localhost:3000/invoice/update/status/:id/:statusType
```
- For sending the invoice through gmail (get request)
```
https://localhost:3000/invoice/send/mail/:id
```
for this, inside the *.env* file add these lines
```
GMAIL_USERID=yourgmail@gmail.com
GMAIL_PASS=your_password
```
