
const jwt = require('jsonwebtoken');

// =============
// ---Verificar Token
//==================


let verificaToken = ( req, res, next ) => {

    let token = req.get('token') //Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no valido.'
                }
            });

        }

        req.usuario = decoded.usuario;
        next();
    })
};


let verificaAdmin_Rol = ( req,res,next ) => {


    let usuario =req.usuario;
    if( usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}




let verificaTokenImg = (req, res, next) => {
    let token =req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no valido.'
                }
            });

        }

        req.usuario = decoded.usuario;
        next();
    })
}

module.exports = {
    verificaToken,
    verificaAdmin_Rol,
    verificaTokenImg
}