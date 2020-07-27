
const express = require('express');

let { verificaToken, verificaAdmin_Rol } = require('../middlewares/autenticacion');
let app = express();

const Categoria = require('../models/categoria');


//================
// Mostrar todas las categorias.
//================


app.get('/categoria', (req, res) => {
//descripcion
    Categoria.find({})
            .sort('descripcion')
            .populate('usuario','nombre email')
            .exec((err, categorias) => {
        if( err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         Categoria.countDocuments({}, (err, cantidad) => {
             
             res.json({
                 ok: true,
                 categorias,
                 cantidad
         })
         })
    })
})
//================
// Mostrar una categoria por ID
//================


app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if( err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         res.json({
             ok: true,
             categoriaDB
         })
    });
    
})

//================
// Crea nueva categoria
//================


app.post('/categoria',verificaToken, (req, res) => {
//regresa la nueva categoria
let body = req.body;
let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
});

    categoria.save((err, categoriaDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!categoriaDB){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         res.json({
             ok:true,
             categoriaDB
         })
    })



})
//================
// Mostrar una categoria por ID
//================
app.put('/categoria/:id', (req,res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true,runValidators:true}, (err, categoriaDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!categoriaDB){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
         res.json({
            ok:true,
            categoriaDB
        })
    })


})


app.delete('/categoria/:id',[verificaToken, verificaAdmin_Rol],  (req, res) => {
    //solo un administrador puede borrar las categorias
    //Categoria.findbyidandremove
    let id = req.params.id;
    

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!categoriaDB){
            return res.status(400).json({
                 ok: false,
                 err:{
                     message: 'El ID no existe.'
                 }
             });
         }
         res.json({
             ok:true,
             message: 'Categoria Borrada.',
             categoria: categoriaDB.descripcion
         })
    } )
})
module.exports = app;