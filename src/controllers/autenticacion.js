require('dotenv').config();
const ServicePg = require('../services/postgress');
const _service = new ServicePg();
const jwt = require('jsonwebtoken');

 /**
  * @description Se toma el parametro con la información del usuario y se valida:
  *  - Que no sea vacio
  *  - Que contenga el e-mail y la contraseña
  * @param {Object} usuario 
  */
  let validarLogin = (usuario) => {
    if (!usuario) {
        throw {
          ok: false,
          message: "La información es obligatoria.",
        };
      }   
      if (!usuario.correo) {
        throw { ok: false, message: "El correo es obligatrio." };
      }
      if (!usuario.contrasena) {
        throw { ok: false, message: "La contraseña es obligatoria." };
      }
  };

  /**
 * @description Verifica si hay un usuario registrado en la base de dados
 * @param {String} correo
 * @returns
 */
   let validarUsuario = async (correo) => {    
    let sql = `SELECT documento, nombre_rol, contrasena 
              FROM public."Usuarios" inner join public."Roles"
                on "Usuarios".id_rol = "Roles".id_rol
              WHERE correo = $1;`;
    let respuesta = await _service.ejecutarSql(sql, [correo]);    
    return respuesta;
  };

  /**
 * @description Almacena la información de un usuario en la base de datos.
 * @param {Object} usuario 
 * @returns 
 */
const guardarUsuario = async (usuario) => {
    
  let sql = `INSERT INTO public."Usuarios"(documento, nombre, id_rol, celular,correo, contrasena)
              select $1, $2,$3, $4,$5, $6
              where not exists(select documento from public."Usuarios" where documento = $1);`;
  let valores = [usuario.documento, usuario.nombre,
                  usuario.id_rol, usuario.celular, 
                  usuario.correo, usuario.contrasena];
  let respuesta = await _service.ejecutarSql(sql, valores);
  return respuesta.rowCount;
};


const generar_token = (usuario) => {
    delete usuario.contrasena;
    return jwt.sign(usuario, process.env.SECRET_KEY, { expiresIn: "4h" });
 
  };

const descifrar_token = (token) => {
    return jwt.decode(token, process.env.SECRET_KEY);
  };

const validar_token = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
  };
module.exports = {
  validarUsuario, generar_token, descifrar_token, validar_token, validarLogin, guardarUsuario}