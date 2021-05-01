/**
 * Ruta encargada de las peticiones de autenticación
 * del usuario en la base de datos
 */


//Se hace un llamado a los servicios, librerías y controloadores necesarios
const express = require("express");
const router = express.Router();
const bcrypt =require('bcrypt');
const _controlador = require("../controllers/autenticacion");
const jwt = require('jsonwebtoken');

/*/ MIDDLEWARE: Filtro
router.use((req, res, next) => {
  try {
    let url = req.url;
    if (url === "/login") {
      // Sigue en la busqueda de otros recursos
      next();
    } else {
      let token = req.headers.token;
      let verificacion = _controller.validar_token(token);
      next();
    }
  } catch (error) {
    res.status(401).send({
      ok: false,
      info: error,
      mensaje: "No autenticado.",
    });
  }
});*/

 /**
 * Petición: Validar usuario
 * Parametros: Vacío
 * Cuerpo: Datos del usuario
 * Respuesta: Usuario autenticado o no autenticado
 */
router.post("/login", (req, res) => {
    try {
        let usuario = req.body;
        //Se validan los campos del usuario
        _controlador.validarLogin(usuario);

        //Se valida la información del usuario y se genera su token respectivo
        _controlador.validarUsuario(usuario.correo)
        .then(answerDB =>{
            let usuario_consulta = answerDB.rowCount > 0 ? answerDB.rows[0] : undefined;
            //Comparación de contraseñas
            
            let ok_pwd =bcrypt.compareSync(usuario.contrasena, usuario_consulta.contrasena);
                if (usuario_consulta && ok_pwd) {
                    //Se genera el token para ese usuario
                    let token = _controlador.generar_token(usuario_consulta);
                    
                    res.status(200).send({
                        ok: true,
                        info: token,
                        message: "Usuario autenticado"
                    });
                } else {
                    res.status(401).send({
                        ok: false,
                        info: {},
                        message: "Correo y/o contraseña incorrectos."
                    })
            }          
        })
        .catch((error) => {
            res.status(500).send({ fallo: error, mensaje: "ERROR" });
          });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// Guarda un nuevo usuario
router.post("/signUp", async (req, res) => {
  try {
    //Se encripta la contraseña usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPW = await bcrypt.hash(req.body.contrasena, salt);

    //Cambio de contraseña
    req.body.contrasena=hashPW;
    let info_usuario = req.body;
  
    //Validación de daatos del usuario
    _controlador.validarUsuario(info_usuario);

    //Almacenamiento en base de datos
    _controlador
    .guardarUsuario(info_usuario)
      .then((answerDB) => {
        let answer_rowcount = answerDB;
        
        switch (answer_rowcount) {
          case 1:
            res.status(201).send({ ok: true, mensaje: "Usuario guardado"});
            break;
          case 0:
            res.status(409).send({ ok: true, mensaje: "El usuario ya está registrado"});
            break; 
          default:
            break;
        }          
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
     
  } catch (error) {
      console.log(error); 
    res.send(error);
  }
});


router.get("/verificar", (req, res) => {
  try {
    let token = req.headers.token;

    let verificacion = _controlador.validar_token(token);
    res.status(200).send({
      ok: true,
      info: verificacion,
      mensaje: "Autenticado.",
    });
  } catch (error) {
    res.status(401).send({
      ok: false,
      info: error,
      mensaje: "No autenticado.",
    });
  }
});


module.exports = router;