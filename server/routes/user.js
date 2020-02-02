const express = require('express')
const app = express()
const bcrypt = require('bcryptjs');
const _ = require('underscore')

const User = require('../models/user');

const { validateToken, validateAdminRole } = require('../middlewares/authentication');

app.get('/users', validateToken, (req, res) => {

    let from = Number(req.query.from) || 0;

    let take = Number(req.query.take) || 5;

    User.find({ IsActive: true }, 'name email role IsActive google image')
        .skip(from)
        .limit(take)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ IsActive: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                })
            });

        })
});

app.post('/users', [validateToken, validateAdminRole], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, entity) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            user: entity
        });
    });

})

app.put('/users/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, entity) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: entity
        });

    });
})

app.delete('/users/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;

    User.findByIdAndUpdate(id, { IsActive: false }, { new: true }, (err, entity) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!entity) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: entity
        })
    });
});


module.exports = app;