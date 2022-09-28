const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel2} = require('../lib/autenticar');
const ahora = require('../lib/ahora');

router.get('/',accesoNivel2, async (req,res,next)=> {

    res.render('ingreso');
});
router.post('/',accesoNivel2,async (req,res,next)=> {
    const nuevoAcceso = {
        idEdificio: req.user.edificio,
        idUsuario: req.user.username,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombre: req.body.nombresPersona,
        fecha: ahora.ahora(),
        hora: new Date().toLocaleTimeString(),
        actividad: 'Ingreso'
    }
    console.log(await ahora);
    const nuevoAccesoEdificio = {
        idEdificio: req.user.edificio,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombres: req.body.nombresPersona
    }

    const regActividad = await db.query('INSERT INTO registroactividad SET ?',[nuevoAcceso]);
    const regEdificio = await db.query('INSERT INTO personasenedificio SET ?',[nuevoAccesoEdificio]);
    
    
    req.flash('mensaje','Ingreso registrado exitosamente');   
    res.redirect('/');

});

module.exports = router