const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1, logueado} = require('../lib/autenticar');

router.get('/:id',logueado, async (req,res,next)=> {
    miId = req.params;

    const miMensaje = await db.query('SELECT * FROM mensajes WHERE id = ?',[miId.id]);

    return res.render('leerMensaje', {miMensaje: miMensaje[0], recibido: false});
});


module.exports = router