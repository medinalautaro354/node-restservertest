const express = require('express');
const app = express();
const { validateToken } = require('../middlewares/authentication');
const _ = require('underscore');

let Product = require('../models/product');
let User = require('../models/user');
let Category = require('../models/category');

app.get('/products', validateToken, (req, res) => {

    let from = Number(req.query.from) || 0;

    let take = Number(req.query.take) || 0;

    Product.find({ available: true })
    .populate('user', 'name email')
    .populate('category', 'name')
        .skip(from)
        .limit(take)
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            })
            
        });
});

app.get('/products/:id', validateToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, entity) => {
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
            product: entity
        });
    });
});

app.get('/products/search/test', validateToken, (req, res) =>{

    let name = req.query.name;

    let regex = new RegExp(name, 'i');

    let from = Number(req.query.from) || 0;

    let take = Number(req.query.take) || 0;

    Product.find({name: regex})
    .populate('user', 'name email')
    .populate('category', 'name')
    .skip(from)
    .limit(take)
    .exec((err, products) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            products
        })
    });
});

app.post('/products', validateToken, (req, res) => {

    let body = req.body;

    let user = req.user;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.categoryId,
        user: user
    });

    product.save((err, entity) => {
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
            product: entity
        })
    });

});

app.put('/products/:id', validateToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'price', 'description', 'category']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, entity) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: entity
        });
    });

});

app.delete('/products/:id', validateToken, (req, res) => {

    let id = req.params.id;

    Product.findByIdAndUpdate(id, { available: false }, (err, entity) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: entity,
            message: `Se elimino el producto con id ${id}.`
        });

    })
})

module.exports = app;