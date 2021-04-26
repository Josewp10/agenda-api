require('dotenv').config()
const express = require('express');
const app = express();

app.listen(process.env.PORT, ()=>{
    console.log(`Escuchando API en http://localhost:${process.env.PORT}`);
})

