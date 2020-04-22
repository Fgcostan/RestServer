const express = require('express');
const { VerificarToken, VerificarAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');

const app = express();

//Muestra todas las categorias
app.get('/categoria', VerificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {

                res.json({
                    ok: true,
                    categoriasDB,
                    total: conteo
                });
            });
        });
});


//Muestra una categoria por id
app.get('/categoria/:id', VerificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'El id no es correcto'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//Crea una nueva categoria y regresa la nueva categoria
app.post('/categoria', VerificarToken, (req, res) => {
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//Actualiza una categoria
app.put('/categoria/:id', VerificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'categoria actualizada',
            categoria: categoriaDB
        });

    });
});


//Borra una categoria (fisicamente) solo admin puede
app.delete('/categoria/:id', [VerificarToken, VerificarAdmin_Role], (req, res) => {
    //categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria Borrada',
            categoria: categoriaDB
        });

    });

});

module.exports = app;