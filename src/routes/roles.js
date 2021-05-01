/**
 * Ruta encargada de las peticiones de los posibles roles
 * del usuario en la base de datos
 */


//Se hace un llamado a los servicios, librerías y controloadores necesarios
const express = require("express");
const router = express.Router();
const _controlador = require("../controllers/autenticacion");

const roles;
 /**
 * Petición: Consultar roles
 * Parametros: Vacío
 * Cuerpo: Vacío
 * Respuesta: Roles en la base de datos o error
 */

 router.get('/roles', (req, res)=>{
    
 });

 module.exports={router, roles};