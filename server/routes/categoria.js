const express = require('express')
const app = express();
const { verificationToken,verificarAdminRole } = require('../middlewares/autenticacion')
let Categoria = require('../models/categoria')

/** muestra todas las categorias */
app.get('/categoria', (req,res) => {
    let limite = Number ( req.query.limite ) || 5
    let hasta = Number ( req.query.hasta )  || 0
    
    Categoria.find({})
             .sort('descripcion')
             .populate('usuario','nombre email')
             .exec( (err,data) => {
                 if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                Categoria.countDocuments((err,cantidad) => {
                    res.json({
                        ok: true,
                        cantidad,
                        categoria: data
                    })
                })
             })
})

/** muestra las categorias por un id */
app.get('/categoria/:id', (req,res) => {

    let id = req.params.id

    Categoria.findById(id, (err,data) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
        if(!data)
            return res.status(400).json({
                ok: false,
                message: 'no se encontro la categoria'
            })

        res.json({
            ok: true,
            categoria: data
        })

    })
})


/**crea una nueva categoria */
app.post('/categoria', verificationToken, (req,res) => {
    /**regresa la nueva categoria */
    let body = req.body
    let id = req.usuario._id

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    })

    categoria.save( (err, data) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
        if(!data)
            return res.status(400).json({
                ok: false,
                err
            })

        res.json({
            ok: true,
            categoria: data
        })
    })
})

/**actulizar la categoria */
app.put('/categoria/:id', verificationToken, (req,res) => {
    let id = req.params.id
    let body = req.body


    Categoria.findByIdAndUpdate( id, {descripcion: body.descripcion} , {new: true, runValidators: true}, (err,data) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !data ){
            return res.status(400).json({
                ok: false,
                message: 'no se encontro la categoria'
            })
        }

        res.json({
            ok: true,
            categoria: data
        })
    })
})

/**
 * solo un administrador puede borrar categorias
 * no desactivar la categoria, se debe eliminar de la base de datos
 */
app.delete('/categoria/:id', [verificationToken,verificarAdminRole], (req,res) => {

    let id = req.params.id

    Categoria.findByIdAndRemove( id, (err,data)=>{
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
        
        if(!data) 
            return res.status(400).json({
                ok: false,
                message: 'no se encontro la categoria'
            })

        res.json({
            ok: true,
            message: 'categoria borrada'
        })
    })

})




module.exports = app