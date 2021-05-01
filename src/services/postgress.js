const {Pool} = require('pg');
require('dotenv').config()

class ServicioPG {
    
    constructor(){
        this.pool = new Pool({
            user: process.env.USERDB,
            host: process.env.HOSTDB,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            ssl: { rejectUnauthorized: false },
            port: process.env.PORTPG
        });
    }

    // Ejecuta la clase y el metodo se debe hacer
// de forma asincrona para que respuesta tenga un valor
  
async ejecutarSql(sql,params) {
    let respuesta = await this.pool.query(sql,params);
    return respuesta;
  }
}

// Exporta la clase, para poder ser utilizada desde otros archivos

module.exports = ServicioPG;