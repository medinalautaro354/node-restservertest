const express = require('express');

let { validateToken, validateAdminRole } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');
let User = require('../models/user');

app.get('/categories', validateToken, (req, res) => {

    let from = Number(req.query.from) || 0;

    let take = Number(req.query.take) || 5;

    Category.find({ isActive: true }, 'name isActive user')
        .sort('name')
        .skip(from)
        .limit(take)
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.populate(categories, ['user'], (err, categories) => {
                Category.countDocuments({ isActive: true }, (err, count) => {
                    if (err) {
                        return res.status(400)
                            .json({ ok: false, err })
                    }

                    return res.json({
                        ok: true,
                        categories,
                        count
                    });
                })
            })

        })



});


app.get('/categories/:id', validateToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, entity) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entity) {
            return res.status(400).json({
                ok: true,
                message: `No existe categoria con el id ${id}.`
            });
        }

        return res.json({
            ok: true,
            category: entity
        });
    })

});


app.post('/categories', [validateToken, validateAdminRole], (req, res) => {
    let body = req.body;

    let user = req.user;


    let category = new Category({
        name: body.name,
        user: user._id
    });

    category.save((err, entity) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entity) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            category: entity
        })
    })
});

app.put('/categories/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, entity) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: entity
        })
    });
});

app.delete('/categories/:id', [validateToken, validateAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, entity) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entity) {
            return res.status(400).json({
                ok: false,
                message: `No existe la categoria con el id: ${id}.`
            });
        }

        res.json({
            ok: true,
            message: 'Se elimino correctamente la categoria.'
        });
    });

});

module.exports = app;
