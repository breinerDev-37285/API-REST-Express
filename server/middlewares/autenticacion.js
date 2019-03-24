/**
 * middlewar token
 */

 const jwt = require('jsonwebtoken')

 const verificationToken = (req,res,next)=>{
    let token = req.get('token')

    jwt.verify(token,process.env.Semilla,(err,data) => {
        if(err){
            res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = data.usuario
        next();
    })
 }

const verificarAdminRole = (req,res,next) => {

    let usuario = req.usuario


    if(usuario.role !== 'ADMIN_ROLE'){

       return res.status(400).json({
            ok: false,
            message: 'no es un usuario administrador'
        })

    }
    next();
}

const verificationTokenImagen = (req,res,next)=>{
    let token = req.query.token

    jwt.verify(token,process.env.Semilla,(err,data) => {
        if(err){
            res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = data.usuario
        next();
    })
 }


 module.exports = {
     verificationToken,
     verificarAdminRole,
     verificationTokenImagen
 }