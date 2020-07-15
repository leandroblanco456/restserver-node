


const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const app = express();







app.post('/login', (req, res) => {


    let body = req.body;
//--Busca uno y usa la condicion email sea igual a la recibida por parametro
    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{

        //error interno
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        //comprobamo usuario
        if( !usuarioDB ) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: "(Usuario) o password incorrectos"
                }
            });
        }
        //comprobamos contraseña
        if( !bcrypt.compareSync( body.password, usuarioDB.password )) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: "Usuario o (password) incorrectos"
                }
            });
        }

//Las variables utilizadas estan en config.js
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })

    });

   

})






module.exports = app;