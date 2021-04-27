/**
 * Controlador encargado de validar las peticiones contra la base de datos
 * para la gestión de usuarios
 */

//Llamado a todas las librerías y servicios requeridos
const ServicioPG = require('../services/postgress');
let _servicio = new ServicioPG();

/**
 * @description Se toma el parametro con la información del usuario de dosis y se valida:
 *  - Que no sea vacío
 *  - Que contenga los campos: nombre, correo, celular, id_tipo.
 * @param {Object} usuario 
 */
const validarUsuario = usuario => {
    if (!usuario) {
        throw{
            ok: false,
            mensaje: 'Ingrese la información del usuario'
        };
    }else if(!usuario.documento){
        throw{
            ok: false,
            mensaje: 'Ingrese la cedula del usuario'
        };
    }else if(!usuario.nombre){
        throw{
            ok: false,
            mensaje: 'Ingrese el nombre del usuario'
        };
    }else if(!usuario.id_rol){
        throw{
            ok: false,
            mensaje: 'Ingrese el rol del usuario'
        };
    }else if(!usuario.celular){
        throw{
            ok: false,
            mensaje: 'Ingrese el numero celular del usuario'
        };
    }else if(!usuario.contrasena){
        throw{
            ok: false,
            mensaje: 'Ingrese la contraseña'
        };
   
    }
};

/**
 * @description Consulta la información de todos los usuarios registrados en la base de datos.
 * @returns 
 */
const consultarUsuarios = async () => {
    let sql = `SELECT id_usuario, documento, nombre, "Usuarios".id_rol, "Roles".nombre_rol, celular, correo
                FROM public."Usuarios" inner join public."Roles"
                on "Usuarios".id_rol = "Roles".id_rol;`;
    let respuesta = await _servicio.ejecutarSql(sql);
    return respuesta;
};

const consultarUsuariosNombreyId = async () => {
    let sql = `SELECT  "Usuarios".documento, "Usuarios".nombre
    FROM public."Usuarios";`;
    let respuesta = await _servicio.ejecutarSql(sql);
    return respuesta
};

/**
 * @description Consulta la información de un usuario en la base de datos.
 * @param {int} id_usuario 
 * @returns 
 */
const consultarUsuario = async (id_usuario) => {
    let sql = `SELECT id_usuario, documento, nombre, "Usuarios".id_rol, "Roles".nombre_rol, celular, correo
	FROM public."Usuarios" inner join public."Roles"
	on "Usuarios".id_rol = "Roles".id_rol
	where documento = $1;`;
    let respuesta = await _servicio.ejecutarSql(sql, [id_usuario]);
    return respuesta;
};

/**
 * @description Consulta el número de celulat de un usuario específico en la base de datos.
 * @param {int} id_usuario 
 * @returns 
 */
const consultarCelUsuario = async (id_usuario) => {
    let sql = `  SELECT celular FROM public."Usuarios" where documento = $1;`;
    let respuesta = await _servicio.ejecutarSql(sql, [id_usuario]);
    return respuesta;
};

/**
 * @description Almacena la información de un usuario en la base de datos.
 * @param {Object} usuario 
 * @returns 
 */
const guardarUsuario = async (usuario) => {
    
    let sql = `INSERT INTO public."Usuarios"(
            documento, nombre, id_rol, celular,correo, contrasena)
            VALUES ($1, $2, $3, $4, $5, $6);`;
    let valores = [usuario.documento, usuario.nombre,
                    usuario.id_rol, usuario.celular, 
                    usuario.correo, usuario.contrasena];
    let respuesta = await _servicio.ejecutarSql(sql, valores);
};

/**
 * @description Modifica la información de un usuario.
 * @param {Object} usuario 
 * @param {String} documento
 * @returns 
 */
 const editarUsuario = async (usuario, documento) => {
    if (usuario.documento != documento) {
      throw {
        ok: false,
        mensaje: "El id del usuario no corresponde al enviado",
      };
    }
    let sql =`UPDATE public."Usuarios"
            SET nombre=$1, id_rol=$2, celular=$3, correo=$4
            WHERE documento=$5;`;
    let valores = [usuario.nombre, usuario.id_rol, usuario.celular,usuario.correo, 
      usuario.documento];
    let respuesta = await _servicio.ejecutarSql(sql, valores);
    return respuesta;
  };

/**
 * @description Modifica la contraseña de un usuario.
 * @param {Object} usuario 
 * @param {String} documento
 * @returns 
 */
 const editarContrasena = async (usuario, documento) => {
    if (usuario.documento != documento) {
      throw {
        ok: false,
        mensaje: "El id del usuario no corresponde al enviado",
      };
    }
    let sql =`UPDATE public."Usuarios"
            SET contrasena=$1
            WHERE  documento=$2;`;
    let valores = [usuario.contrasena, usuario.documento];
    let respuesta = await _servicio.ejecutarSql(sql, valores);
  };

/**
 * @description Elimina un usuario de la base de datos.
 * @param {String} documento 
 * @returns
 */
 const eliminarUsuario = async (documento) => {
    let sql = `DELETE FROM public."Usuarios" where documento = $1;`;    
    let respuesta = await _servicio.ejecutarSql(sql, [documento]);
    return respuesta;
};

module.exports = {validarUsuario, consultarUsuario, consultarUsuarios,
     consultarCelUsuario, consultarUsuariosNombreyId ,editarContrasena,
     guardarUsuario, editarUsuario, eliminarUsuario};
