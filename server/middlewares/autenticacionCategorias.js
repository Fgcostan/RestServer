let Categoria = require('../models/categoria');


let VerificarCategoria = (req, res, next) => {
    let categoria = req.body.categoria;

    Categoria.find({ descripcion: categoria }, (err, CategoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'La categoria no existe'
            });
        }

        req.categoria = CategoriaDB[0];
        //console.log(CategoriaDB);
        next();
    });
}

module.exports = {
    VerificarCategoria
}