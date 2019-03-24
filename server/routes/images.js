const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const { verificationTokenImagen } = require('../middlewares/autenticacion')

app.get('/imagenes/:tipo/:img',verificationTokenImagen, (req,res) => {

    let tipo = req.params.tipo
    let img = req.params.img
    
    let pathImg = path.resolve( __dirname , `../../uploads/${ tipo }/${ img }` )
    
    if( fs.existsSync(pathImg) ){
        res.sendFile( pathImg )
    }else{
        let pathnoImg= path.resolve( __dirname , '../assets/img/no-image.jpg' )
        res.sendFile(pathnoImg)       
    } 


});

module.exports = app