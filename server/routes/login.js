const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    //console.log('token', token);
    let GoogleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ email: GoogleUser.email }, (err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (UserDB) {
            if (UserDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal o borrase previamente'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: UserDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
                return res.json({
                    ok: true,
                    user: UserDB,
                    token
                });
            }
        } else {
            // si el usuario no existe
            let usuario = new Usuario();

            usuario.nombre = GoogleUser.nombre;
            usuario.email = GoogleUser.email;
            usuario.img = GoogleUser.img;
            usuario.google = true;
            usuario.password = ';)';

            usuario.save((err, NewUserDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: UserDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: UserDB,
                    token
                });
            });
        }
    });
});

module.exports = app;