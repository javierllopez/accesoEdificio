const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/', accesoNivel1,async (req,res,next)=> {
    const cadena = 'SELECT idEdificio, idUsuario, idAdmin, usuarios.username, usuarios.apellido, usuarios.nombres, usuarios.acceso, usuarios.estado, edificios.descripcion FROM edificiosusuarios INNER JOIN edificios ON idEdificio = edificios.id INNER JOIN usuarios ON idUsuario = usuarios.username WHERE idAdmin = ? AND usuarios.acceso = 2 ORDER BY edificios.descripcion';
    
    const usuarios = await db.query(cadena,[req.user.username]);

    res.render('usuarios',{usuarios:usuarios,
        helpers: {
            color: (estado)=>{
                if (estado == 'Habilitado') return 'green';
                if (estado == 'Deshabilitado') return 'red';
            },
            boton: (estado)=> {
                if (estado == 'Habilitado') return 'Deshabilitar';
                if (estado == 'Deshabilitado') return 'Habilitar'
            },
            link: (estado)=> {
                if (estado == 'Habilitado') return '/deshabilitarUsuario';
                if (estado == 'Deshabilitado') return '/habilitarUsuario';
            }
            
        }
    });
})

module.exports = router