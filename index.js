require('dotenv').config()
const express = require('express');
//const cors = require('cors');


const app = express();
app.use(express.json());


//Endpoint
app.get('/', (req,res) =>{
    res.send('Bienvenido!!');
});

const ruta_autenticacion = require('./routes/autenticacion');
app.use(ruta_autenticacion);

const ruta_usuarios = require('./routes/usuarios');
app.use(ruta_usuarios);



app.listen(process.env.PORT, ()=>{
    console.log(`Escuchando API en http://localhost:${process.env.PORT}`);
})

