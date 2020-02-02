const express = require('express')
const app = express()
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email, IsActive: true }, (err, entity) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entity) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, entity.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos.'
                }
            });
        }

        let token = jwt.sign({
            user: entity
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN })

        res.json({
            ok: true,
            user: entity,
            token
        })
    });
})

module.exports = app;
