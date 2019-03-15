const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Usuario = require('../models/usuarios')
const bcrypt = require('bcrypt')
const _ = require('underscore')


app.use( bodyParser.urlencoded({ extended: false }) )
app.use( bodyParser.json() )

/*app.get('/usuario', (req,res) => {
    
    let desde = Number(req.query.desde || 0 )
    let limite = Number(req.query.limite || 5 )
    let filtro = { estado: true }

    Usuario.find({},'nombre email estado img role google')
           .skip(desde)
           .limit(limite)
           .exec( (err,usuario) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.count({}, (err,cantidad) => {
                    res.json({
                        ok: true,
                        cantidad,
                        usuario
                    })
                })
           })
});*/

app.get('/usuario',(req,res) =>{
    res.send('get Usuario')
})


app.post('/usuario',(req,res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password,10 ),
        img: body.img,
        estado: body.estado,
        role: body.role,
        google: body.google
    })

    usuario.save((err,usuario) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario
        })
    })
})

app.put('/usuario/:id', (req,res) => {
    let id = req.params.id
    let objeto = _.omit(req.body,['password','email','google'])
    let opc = {
        new: true,
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id,objeto,opc,(err,usuario)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                message: 'no se encontro el usuario'
            })
        }

        res.json({
            ok: true,
            usuario
        })
    });
});

app.delete('/usuario/:id', (req,res) => {
    let id = req.params.id
    
    // eliminacion para el registro de usuario en la base de datos

    /*Usuario.findByIdAndRemove(id,(err,usuario)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                message: 'usuario no existe'
            })
        }

        res.json({
            ok: true,
            usuario
        })
    });*/


    /** cambio de estado a inactivo en los registros */

    Usuario.findByIdAndUpdate(id,{ estado:false },{ new:true },(err, usuario) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario
        })
    })
});



module.exports = app;