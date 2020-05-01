const express = require('express');
const fs = require('fs');
const path = require('path');

const { VerificarTokenIMG } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', VerificarTokenIMG, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let NoImgPath = path.resolve(__dirname, '../assets/original.jpg');

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(NoImgPath);
    }
});


module.exports = app;