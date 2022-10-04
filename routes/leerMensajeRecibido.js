const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1, logueado} = require('../lib/autenticar');

router.get('/:id',logueado, async (req,res,next)=> {
    miId = req.params;

    const miMensaje = await db.query('SELECT * FROM mensajes WHERE id = ?',[miId.id]);

    return res.render('leerMensaje', {miMensaje: miMensaje[0], recibido: true});
});

router.get('/mensajeLeido/:id',logueado,async(req,res,next)=> {
    miId = req.params;
    console.log('Entró en mensaje leido');
    await db.query('UPDATE mensajes SET ? WHERE id = ?',[{estado: 'Leído'},miId.id]);

    return res.redirect('/');
});

module.exports = router