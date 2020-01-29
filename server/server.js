const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('./config/config');

// parse application/x-www-form-urlencoded middleware son los use
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


mongoose.connect(process.env.ConnectionString,
    { useNewUrlParser: true, useCreateIndex: true },
    (err) => {
        if (err) throw err;

        console.log('Test BD ');
    });

app.use(require('./routes/user'));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});