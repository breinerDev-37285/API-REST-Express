require('./config/config')
const express = require('express')
const app = express();
const colors = require('colors/safe')
const mongoose = require('mongoose')

app.use( require('./routes/index') )

mongoose.connect(process.env.URLDB,{
    useCreateIndex: true,
    useNewUrlParser: true
})

  .then( db => console.log('database conectada'))
  .catch( err => console.log(err))


app.listen( process.env.PORT, () =>{
    console.log( colors.magenta('escuchando el puerto: ', colors.yellow(process.env.PORT)) )
})