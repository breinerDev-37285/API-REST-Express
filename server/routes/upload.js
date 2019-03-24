const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')
let Usuario = require('../models/usuario')
let Producto = require('../models/producto')

app.use( fileUpload() )

app.put('/upload/:tipo/:id',(req,res) => {

    let tipo = req.params.tipo
    let id = req.params.id

    if( !req.files )
        return res.status(500).json({
            ok: false,
            message: 'no se encontro el archivo'
        })
    
    let archivo = req.files.archivo

    let extensionesPermitida = ['jpg','jpeg','png','gif']
    let nombreArchivo = archivo.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length-1]
    
    let nombre = `${id}-${new Date().getMilliseconds()}.${extension}`

    let tipos = ['usuarios','productos']

    if( extensionesPermitida.indexOf( extension ) < 0 ){

        return res.status(400).json({
            ok: false,
            message: `solo se permiten las extensiones: ${extensionesPermitida.join(', ')}`
        })

    }else{
        if( tipos.indexOf( tipo ) < 0 ){
            return res.status(400).json({
                ok: false,
                message: `solo se permiten los tipos: ${tipos.join(', ')}`
            })
        }else{
            archivo.mv( `./uploads/${tipo}/${nombre}`, err => {
                if(err)
                    return res.status(500).json({
                        ok: false,
                        err
                    })
             
                if(tipo === 'usuarios'){
                    actualizarImgUsuario(id,res,nombre,tipo);
                }else{
                    actualizarImgProducto(id,res,nombre,tipo);
                }
            })
        }
    }
})


const actualizarImgUsuario = ( id,res,nombre,tipo) =>{

    Usuario.findById(id, (err,data) => {
        if(err){
            borrarArchivo(nombre,tipo)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if( !data ){
            borrarArchivo(nombre,tipo)
            return res.status(400).json({
                ok: false,
                message: 'usuario no existe'
            })
        }
         
        borrarArchivo(data.img,tipo)

        data.img = nombre

        
        data.save( (err,datadb) => {
            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                })

            res.json({
                ok: true,
                message: 'imagen subida correctamente',
                usuario: datadb
            })
        })
        
    })
}

const actualizarImgProducto = ( id,res,nombre,tipo) =>{

    Producto.findById(id, (err,data) => {
        if(err){
            borrarArchivo(nombre,tipo)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if( !data ){
            borrarArchivo(nombre,tipo)
            return res.status(400).json({
                ok: false,
                message: 'Producto no existe'
            })
        }
         
        borrarArchivo(data.img,tipo)

        data.img = nombre

        
        data.save( (err,datadb) => {
            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                })

            res.json({
                ok: true,
                message: 'imagen subida correctamente',
                usuario: datadb
            })
        })
        
    })
}


const borrarArchivo = (img,tipo) => {
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${img}` )
    if( fs.existsSync(pathImagen) )
        fs.unlinkSync(pathImagen)
}

module.exports = app