const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const { accesoNivel2 } = require('../lib/autenticar');
const ahora = require('../lib/ahora');

router.get('/', accesoNivel2, async (req, res, next) => {

    res.render('ingreso');
});
router.post('/', accesoNivel2, async (req, res, next) => {

    if (req.body.DNIPersona < 1000000) {
        req.flash('error', 'Debe ingresar un D.N.I. válido');
        return res.redirect('/ingreso');
    }
    if (req.body.apellidoPersona == '') {
        req.flash('error', 'Debe ingresar el apellido de la persona');
        return res.redirect('/ingreso');
    }
    if (req.body.nombresPersona == '') {
        req.flash('error', 'Debe ingresar el nombre de la persona');
        return res.redirect('/ingreso');
    }

    const estaAdentro = await db.query('SELECT * FROM personasenedificio WHERE idEdificio = ? AND idPersona = ?', [parseInt(req.user.edificio), parseInt(req.body.DNIPersona)]);
    if (estaAdentro.length > 0) {
        req.flash('error', 'Esta persona ya ingresó al edificio');
        return res.redirect('/ingreso');
    }

    if (req.body.pisoDestino == 0 ) {
        req.flash('error','Debe ingresar a qué piso va la persona');
        return res.redirect('/ingreso');
    }

    if (req.body.deptoDestino == '') {
        req.flash('error','Debe ingresar a qué departamento va la persona');
        return res.redirect('/ingreso');
    }
    const nuevoAcceso = {
        idEdificio: req.user.edificio,
        idUsuario: req.user.username,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombre: req.body.nombresPersona,
        fecha: ahora.ahora(),
        hora: new Date().toLocaleTimeString(),
        actividad: 'Ingreso',
        piso: req.body.pisoDestino.toString(),
        depto: req.body.deptoDestino,
        observaciones: req.body.observacionesDestino
    }
    console.log(await ahora);
    const nuevoAccesoEdificio = {
        idEdificio: req.user.edificio,
        idPersona: req.body.DNIPersona,
        apellido: req.body.apellidoPersona,
        nombres: req.body.nombresPersona,
        piso: req.body.pisoDestino.toString(),
        depto: req.body.deptoDestino,
        observaciones: req.body.observacionesDestino
    }

    const regActividad = await db.query('INSERT INTO registroactividad SET ?', [nuevoAcceso]);
    const regEdificio = await db.query('INSERT INTO personasenedificio SET ?', [nuevoAccesoEdificio]);


    req.flash('mensaje', 'Ingreso registrado exitosamente');
    res.redirect('/');

});

module.exports = router