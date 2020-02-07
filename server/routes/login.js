const express = require('express')
const app = express()
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


//configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    let name = payload.name;
    let email = payload.email;
    let image = payload.picture;

    return {
        name,
        email,
        image,
        google: true
    }

}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;


    let googleUser;
    await verify(token)
        .then((data) => {
            googleUser = data;
        })
        .catch(e => {
            console.log(e);
        });

    if (googleUser === undefined) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Token invalido'
            }
        })
    }

    User.findOne({ email: googleUser.email }, (err, entity) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (entity) {
            if (entity.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: entity
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: entity,
                    token
                })
            }
        } else {
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.password = ':)';
            user.google = true;

            user.save((err, entity) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: entity
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: entity,
                    token
                })
            })
        }
    })
})

module.exports = app;
