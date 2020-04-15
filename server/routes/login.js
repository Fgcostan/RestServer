const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!UserDB || !bcrypt.compareSync(body.password, UserDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Password incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: UserDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION }); //min*seg*hs*dd -> 60*60 = 1hs

        res.json({
            ok: true,
            user: UserDB,
            token
        });
    });

});

module.exports = app;