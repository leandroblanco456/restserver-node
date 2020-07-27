

const express = require('express');

let {verificaToken} = require('../middlewares/autenticacion')

const Producto = require('../models/producto');
let app = express();




app.get('/producto', (req, res) => {
    Producto.find({})
            .sort('nombre')
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err, productos) => {
                if( err){
                    return res.status(400).json({
                         ok: false,
                         err
                     });
                 }
                 Producto.countDocuments({}, (err, cantidad) => {
                     res.json({
                         ok: true,
                         productos,
                         cantidad
                     })
                 })  
            })
});


app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err, productos) => {
        if( err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
         res.json({
            ok: true,
            productos
            
        })
    })
})


app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    //para buscar, tenemos que mandar una (expresion regular)
    let regex = new RegExp(termino, 'i')
    Producto.find({nombre: regex})
            .populate('categoria','descripcion')
            .exec((err,productoDB) => {
                if( err){
                    return res.status(400).json({
                         ok: false,
                         err
                     });
                 }
                 res.json({
                    ok: true,
                    productoDB
                    
                })
            })
})

app.post('/producto',verificaToken, (req, res) => {
    
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id        
    });
    producto.save((err, productoDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!productoDB){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         res.status(201).json({
             ok:true,
             productoDB
         })
    })

});


app.put('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni : body.precio,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id,descProducto,{new: true,runValidators:true,useFindAndModify:false}, (err, productoDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!productoDB){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
         res.json({
            ok:true,
            productoDB
        })
    } )



});


app.delete('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndRemove(id, {useFindAndModify:false},(err, productoDB) => {
        if( err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }
        if(!productoDB){
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
             producto: productoDB.nombre
         })
    })
})

module.exports = app;