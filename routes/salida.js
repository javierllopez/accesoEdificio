const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel2} = require('../lib/autenticar');
const ahora = require('../lib/ahora');

router.get('/', accesoNivel2,async (req,res,next)=> {
    const cadena = 'SELECT id, idPersona, apellido, nombres FROM personasenedificio WHERE idEdificio = ?';
    
    const personas = await db.query(cadena,[req.user.edificio]);

    res.render('salida',{personasEnEdificio: personas});
})

router.get('/:id', accesoNivel2,async (req,res,next)=> {
    id = req.params;

    const registro = await db.query('SELECT * FROM personasenedificio WHERE id = ?',[id.id]);
    const nuevaSalida = {
        idEdificio: req.user.edificio,
        idUsuario: req.user.username,
        idPersona: registro[0].idPersona,
        apellido: registro[0].apellido,
        nombre: registro[0].nombres,
        fecha: ahora.fechaActual(),
        hora: ahora.horaActual(),
        actividad: 'Salida'
    }
    console.log(registro);
    if (registro.length = 0) {
        req.flash('error','error al registrar salida');
        return res.redirect('/salida');
    } else {
        await db.query('INSERT INTO registroactividad SET ?',[nuevaSalida]);
        await db.query('DELETE FROM personasenedificio WHERE id = ?',[id.id]);

        req.flash('mensaje','Salida registrada exitosamente');
        return res.redirect('/');
    }

});
module.exports = router