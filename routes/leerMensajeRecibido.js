const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const { fechaActual } = require('../lib/ahora');
const { horaActual} = require('../lib/ahora');
const {accesoNivel1, logueado} = require('../lib/autenticar');

router.get('/:id',logueado, async (req,res,next)=> {
    miId = req.params;

    const miMensaje = await db.query('SELECT * FROM mensajes WHERE id = ?',[miId.id]);

    return res.render('leerMensaje', {miMensaje: miMensaje[0], recibido: true});
});

router.get('/mensajeLeido/:id',logueado,async(req,res,next)=> {
    miId = req.params;

    await db.query('UPDATE mensajes SET ? WHERE id = ? AND estado = "No Leído"',[{estado: 'Leído', fechaLectura: fechaActual(), horaLectura: horaActual()},miId.id]);

    return res.redirect('/');
});

module.exports = router