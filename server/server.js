//Peticiones:
//Get: mas que nada para obtener datos
//Post: se usa mas que nada para crear nuevos registros
//Put: se usa mas que nada para actualizar data
//delete: borrar registros

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let Port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false })); // cada peticion que se hace pasa por estas lineas
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get usuario');
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
});

app.put('/usuario/:id', function(req, res) {
    let user = req.params.id;
    res.json({
        user
    });
});

app.delete('/usuario', function(req, res) { //no se acostumbra a borrar registros
    res.json('delete usuario');
});

app.listen(Port, () => {
    console.log('Escuchando el puerto:', Port);
});