const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const app = express();


app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {
    //console.log(req.files.foo); // the uploaded file object

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se cargo ningun archivo'
            }
        });
    }

    let archivo = req.files.archivo;


    //Validar extension

    let ext = archivo.mimetype.split('/');
    let extension = ext[ext.length - 1];
    let ExtensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (ExtensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `La extension ${extension} no es permitida, en su lugar lo son: ${ExtensionesPermitidas}`
            }
        });
    }


    //Validar tipo

    let tiposPermitidos = ['usuarios', 'productos'];
    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `El Tipo ${tipo} no es permitido, en su lugar lo son: ${tiposPermitidos}`
            }
        });
    }


    //cambiar nombre al archivo

    let nombre = `${id}-${ new Date().getMilliseconds()}.${extension}`;


    // Cargar en DB

    archivo.mv(`uploads/${tipo}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombre);
        else
            imagenProducto(id, res, nombre);
    });

});


let imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        BorrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuarioDB,
                img: nombreArchivo
            })
        });

    })

}

let imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        BorrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                productoDB,
                img: nombreArchivo
            })
        });

    })
}

let BorrarArchivo = (nombreImg, tipo) => {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

module.exports = app;