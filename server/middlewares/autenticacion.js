const jwt = require('jsonwebtoken');


// ===============
// Verificar Token
// ===============

let VerificarToken = (req, res, next) => {
    let token = req.get('Authorization'); //Token

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}



// ===============
// Verificar Admin
// ===============

let VerificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no administrador'
            }
        });
    }
}


// =======================
// Verificar Token por URL
// =======================

let VerificarTokenIMG = (req, res, next) => {

    let token = req.query.Authorization; //Token

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    VerificarToken,
    VerificarAdmin_Role,
    VerificarTokenIMG
}