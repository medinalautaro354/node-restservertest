const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./config/config');

// parse application/x-www-form-urlencoded middleware son los use
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/users', function (req, res) {
    res.json('Users');
})

app.post('/users', function (req, res) {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            mensage: 'El nombre es necesario'
        });
    }
    res.json({
        body
    });
})

app.put('/users/:id', function (req, res) {

    let id = req.params.id;

    res.json({
        id
    });
})

app.delete('/users', function (req, res) {
    res.json('Users');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});