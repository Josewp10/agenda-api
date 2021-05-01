const {validar_token} = require('../controllers/autenticacion');
const {roles} = require('../models/roles');

let auth = (...rolesPermitidos)=>{
   try {
    return(req, res, next)=>{
        let token = req.headers.token;
        
        if(rolesPermitidos.includes(validar_token(token).nombre_rol)){
            next();
        }else{
            res.status(401).send({
                ok: true,
                message: "Usuario no autorizado"
            });
        }  
    } 
   } catch (error) {
       res.send(error);
   }
   
}

let authModificacion = (...rolesPermitidos)=>{
   
    try {
        return(req, res, next)=>{
            let token = validar_token(req.headers.token);
            let id_usuario = req.params.id_usuario;
            
            
            if(rolesPermitidos.includes(token.nombre_rol)){
                
                if (token.nombre_rol !== roles.admin) {                    
                    if (token.documento == id_usuario) {
                        next();
                    } else {
                        res.status(401).send({
                            ok: true,
                            message: "Usuario no autorizado"
                        });
                    }
                }else{
                    next();
                }
            }else{
                res.status(401).send({
                    ok: true,
                    message: "Usuario no autorizado"
                });
            }  
        } 
       } catch (error) {
           res.send(error);
       }   
}

module.exports={
    auth, authModificacion
}