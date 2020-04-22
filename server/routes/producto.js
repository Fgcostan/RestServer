const express = require('express');
const { VerificarToken, VerificarAdmin_Role } = require('../middlewares/autenticacion');
const { VerificarCategoria } = require('../middlewares/autenticacionCategorias');
let Producto = require('../models/producto');

const app = express();


// Listado de productos
app.get('/productos', VerificarToken, (req, res) => {
    //populate usuario y categoria
    //paginado

    let desde = Number(req.query.desde) || 0;
    let limit = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limit)
        .exec((err, ProductosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    ProductosDB,
                    total: conteo
                });
            });
        });

});


// Producto por id
app.get('/productos/:id', VerificarToken, (req, res) => {
    //populate usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, ProductoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.status(201).json({
                ok: true,
                ProductoDB,
            });

        });

});


//Buscar Productos
app.get('/productos/buscar/:termino', VerificarToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //genera una exprecion regular para busqueda

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, ProductosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.status(201).json({
                ok: true,
                ProductosDB,
            });

        });

});


//Crea Producto
app.post('/productos', [VerificarToken, VerificarCategoria], (req, res) => {
    //grabar usr y categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: req.categoria._id,
        usuario: req.usuario._id
    });

    producto.save((err, ProductoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: ProductoDB
        });
    });
});


//actualizar Producto
app.put('/productos/:id', VerificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Producto Actualizado',
            producto: ProductoDB
        });
    });
});


//Borrar Producto
app.delete('/productos/:id', VerificarToken, (req, res) => {
    //escribir disponible como false
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Producto Eliminado',
            producto: ProductoDB
        });
    });
});

module.exports = app;