//Mongo atlas
//usr: fgcosta
//contra: 6ppvyaUrKv6xBdwp

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
let Port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false })); // cada peticion que se hace pasa por estas lineas
app.use(bodyParser.json());
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online');

});

app.listen(Port, () => {
    console.log('Escuchando el puerto:', Port);
});