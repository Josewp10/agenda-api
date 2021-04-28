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
    let sql = `SELECT correo, nombre_rol, contrasena 
              FROM public."Usuarios" inner join public."Roles"
                on "Usuarios".id_rol = "Roles".id_rol
              WHERE correo = $1;`;
    let respuesta = await _service.ejecutarSql(sql, [correo]);    
    return respuesta;
  };

  let generar_token = (usuario) => {
    delete usuario.contrasena;
    let token = jwt.sign(usuario, process.env.SECRET_KEY, { expiresIn: "4h" });
    return token;
  };
  //$2b$10$mYT5TaQ42MaBmV0PZqFXDebpaoYFOguOHbQdCw/2ve0My4ipcrZau

  let descifrar_token = (token) => {
    return jwt.decode(token, process.env.SECRET_KEY);
  };
  let validar_token = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
  };
module.exports = {
  validarUsuario, generar_token, descifrar_token, validar_token, validarLogin
}