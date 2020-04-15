//Peticiones:
//Get: mas que nada para obtener datos
//Post: se usa mas que nada para crear nuevos registros
//Put: se usa mas que nada para actualizar data
//delete: borrar registros

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { VerificarToken, VerificarAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', VerificarToken, function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limit = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img') //muestra esos campos
        .skip(desde)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    users,
                    total: conteo
                });
            });
        });

});

app.post('/usuario', [VerificarToken, VerificarAdmin_Role], function(req, res) {

    //if (req.usuario.role === 'ADMIN_ROLE')
    let body = req.body;
    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role,
        //estado: body.estado,
        //google: body.google
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

app.put('/usuario/:id', [VerificarToken, VerificarAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //uso pick de underscore para filtras los campos que quiero del body

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/usuario/:id', [VerificarToken, VerificarAdmin_Role], function(req, res) { //no se acostumbra a borrar registros

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, deleteUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (deleteUser === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            DeleteUser: deleteUser
        });
    });

    /*  Elimina el registro de la base de datos, no se usa realmente

    Usuario.findByIdAndRemove(id, (err, deleteUser) => {
        ...mismas cosas que en findByIdAndUpdate
    });
*/
});

module.exports = app;