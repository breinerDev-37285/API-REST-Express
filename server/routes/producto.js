const express = require('express')
const app = express();
const { verificationToken } = require('../middlewares/autenticacion')
let Producto = require('../models/producto')


/**obtener todos los productos */

app.get('/producto',(req,res) => {
    /**cargar el usuario y la categoria
     * se requiere que los productos esten paginados
     * se requierer que la paginacion retorne los datos ordenados por descripcion
     */

    let limite = Number( req.query.limite ) || 5
    let desde = Number( req.query.desde ) || 0

    Producto.find({})
            .sort('descripcion')
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .skip( desde )
            .limit( limite )
            .exec( (err,data) => {
                if(err)
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                Producto.countDocuments( (err,cantidad) => {
                    res.status(200).json({
                        ok: true,
                        cantidad,
                        producto: data
                        
                    })
                })
            })
})

/**obtener un producto por id */
app.get('/producto/:id',(req,res) => {
    
    let id = req.params.id

    Producto.findById( id, (err,data) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
        if(!data)
            return res.status(400).json({
                ok: false,
                message: 'no se encontro el producto'
            })
        res.status(200).json({
            ok: true,
            producto: data
        })
    })
    .sort('descripcion')
    .populate('usuario','nombre email')
    .populate('categoria','descripcion')
    .exec()

})



/**se requiere crear un nuevo producto*/

app.post('/producto' , verificationToken, (req,res) => {
    /**grabar el usuario que lo actualizo
    *  grabar la categoria que actualizo
    */

    let id_usuario = req.usuario._id;
    let body = req.body

    let producto = new Producto({
        usuario: id_usuario,
        categoria: body.categoria,
        nombre: body.nombre,
        precioUnit: body.precioUnit,
        descripcion: body.descripcion,
        disponible: body.disponible
    })


    producto.save( (err,data) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
            
        if(!data)
            return res.status(400).json({
                ok: false,
                message: 'no se encontro el producto'
            })

        res.status(201).json({
            ok: true,
            producto: data
        })
    })
})



/**actualizar un nuevo producto*/

app.put('/producto/:id' ,(req,res) => {
   /**grabar el usuario que lo actualizo
    * grabar la categoria que actualizo
    */

    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id,body,{new:true,runValidatos:true},(err,data) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })

        if( !data )
            return res.status(400).json({
                ok: false,
                message: 'no se encontro el producto'
            })
        
        res.json({
            ok: true,
            message: 'producto actualizado con exito',
            producto: data
        })
    })
    .sort('descripcion')
    .populate('usuario','nombre email')
    .populate('categoria','descripcion')
    .exec()

})


/**se requiere realizar busquedas de cualquier producto */

app.get('/productos/search/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })
});


/**cambiar el estado disponible a falso*/

app.delete('/producto/:id' ,(req,res) => {
    /**grabar el usuario que lo actualizo
     * grabar la categoria que actualizo
     */
 
     let id = req.params.id
 
     Producto.findByIdAndUpdate(id,{disponible:false},{new:true,runValidatos:true},(err,data) => {
         if(err)
             return res.status(500).json({
                 ok: false,
                 err
             })
 
         if( !data )
             return res.status(400).json({
                 ok: false,
                 message: 'no se encontro el producto'
             })
         
         res.json({
             ok: true,
             message: 'estado del producto cambiado',
             producto: data
         })
     })
 
 })
 


module.exports = app