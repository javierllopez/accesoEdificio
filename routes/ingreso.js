const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/',accesoNivel1, async (req,res,next)=> {

    res.render('ingreso');
});
router.post('/',accesoNivel1,async (req,res,next)=> {
    const nuevoAcceso = {
        idEdificio: req.user.edificio,
        idUsuario: req.user.username,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombres: req.body.nombresPersona,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        actividad: 'Ingreso'
    }

    const nuevoAccesoEdificio = {
        idEdificio: req.user.edificio,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombres: req.body.nombresPersona
    }

    const regActividad = await db.query('INSERT INTO registroactividad SET ?',[nuevoAcceso]);
    const regEdificio = await dbquery('INSERT INTO personasenedificio SET ?',[nuevoAccesoEdificio]);
    
    
    req.flash('mensaje','Ingreso registrado exitosamente');   
    res.redirect('/');

});

module.exports = router