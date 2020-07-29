
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path');

app.use(fileUpload());


app.put('/upload/:tipo/:id', (req,res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if(!req.files){
    return res.status(400).json({
        ok: false,
        err: {
            message: 'No se a seleccionado ningun archivo'
        }
    
    })
}

    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)< 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message:' Los tipos  validos son : '+tiposValidos.join(','),
                tipoRecibida: tipo
            }
        })
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length -1];
    console.log(extension);
    
//Extensiones permitidas.
let extensionesValidas = ['png','jpg','gif','jpeg']
//Si esto no es valido, la extension del archivo no es valida.
if (extensionesValidas.indexOf(extension) <0) {
    return res.status(400).json({
        ok:false,
        err:{
            message:' Las extensiones validas son'+extensionesValidas.join(','),
            extensionRecibida: extension
        }
    })
}
//cambiar nombre a archivo
//ID-IMAGENnombre-123123.jpg
let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(tipo==='productos') {

            imagenProducto(id, res,nombreArchivo);
        } else{

            imagenUsuario(id, res,nombreArchivo);
        }
        //imagen cargada.
        
        

    })
});

function imagenProducto(id,res,nombreArchivo){
    console.log('estoy en imagenProducto');
    Producto.findById(id, (err, productoDB) => {
        if(err){
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok:false,
                err
            })
        } 
        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')
        console.log(productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })

    })
}

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) => {
        console.log('estoy en imagenUsuario');
        if(err){
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}


/**
 *  debo corroborrar si la imagen existe para borrarla
 *  tamb debo crear la Ruta del archivo
 * @param {*} nombreImagen 
 * @param {string} tipoImagen
 * Usuario o Producto.
 */
function borraArchivo(nombreImagen,tipoImagen) {
    let pathImagen =path.resolve(__dirname, `../../uploads/${tipoImagen}/${nombreImagen}`);
    if( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;