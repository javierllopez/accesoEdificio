const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const ahora = require('../lib/ahora');
const {accesoNivel1, logueado} = require('../lib/autenticar');

router.get('/',logueado, async (req,res,next)=> {
    let cadenaSQL = '';

    if (req.user.acceso == 1) {
        cadenaSQL = 'SELECT username as destinatario, admin as admin FROM usuarios WHERE admin = ?'

    } else {
        cadenaSQL = 'SELECT admin as destinatario, username as username FROM usuarios WHERE username = ?'
    }

    const resultado = await db.query(cadenaSQL,[req.user.username])
    

    res.render('enviarMensaje',{destinatarios: resultado});
});
router.post('/',logueado,async (req,res,next)=> {

    if (req.body.asuntoMensaje == '') {
        req.flash('error', 'Debe ingresar un asunto al mensaje');
        return res.redirect('/enviarMensaje');
    }

    if (req.body.mensaje == '') {
        req.flash('error','Mensaje vacío');
        return res.redirect('/enviarMensaje');
    }

    const nuevoMensaje = {
        remitente: req.user.username,
        destinatario: req.body.destinatario,
        asunto: req.body.asuntoMensaje,
        mensaje: req.body.mensaje,
        fecha: ahora.ahora(),
        hora: new Date().toLocaleTimeString(),
        estado: 'No Leído'
    }

    await db.query('INSERT INTO mensajes SET ?',[nuevoMensaje]);
    
    req.flash('mensaje','Mensaje enviado');   
    res.redirect('/');

});

module.exports = router