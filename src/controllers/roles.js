
const ServicioPG = require('../services/postgress');
const _controlador = new ServicioPG();

/**
 * @description Consulta la lista de roles en la base de datos
 * @returns 
 */
let consultarRoles = async()=>{
    let sql = `Select nombre_rol from public."Roles";`;
    await _controlador.ejecutarSql(sql)
    .then(answerDB => {
      console.log(`C: ${answerDB.rows}`);
      return answerDB.rows;
    }).catch(error =>{
      return error;
  });
    
}


module.exports={consultarRoles}