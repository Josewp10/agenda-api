require('dotenv').config()
const express = require('express');

const app = express();
app.use(express.json());

//Endpoint
app.get('/', (req,res) =>{
    res.send('Bienvenido a PIG Plataforma de gestión ganadera');
});


const ruta_usuarios = require('./routes/usuarios');
app.use(ruta_usuarios);

app.listen(process.env.PORT, ()=>{
    console.log(`Escuchando API en http://localhost:${process.env.PORT}`);
})

