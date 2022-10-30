const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const ahora = require('../lib/ahora');
const { accesoNivel1, logueado } = require('../lib/autenticar');

router.get('/', logueado, async (req, res, next) => {
    let cadenaSQL = '';

    if (req.user.acceso == 1) {
        cadenaSQL = 'SELECT username as destinatario, admin as admin FROM usuarios WHERE admin = ?'

    } else {
        cadenaSQL = 'SELECT admin as destinatario, username as username FROM usuarios WHERE username = ?'
    }

    const resultado = await db.query(cadenaSQL, [req.user.username]);


    res.render('consultarMensajesEnviados', { destinatarios: resultado });
});
router.post('/', logueado, async (req, res, next) => {

    let consultaSQL = 'SELECT * FROM mensajes WHERE remitente = ' + '"' + req.user.username + '"';

    //Valido fecha desde y hasta

    if (req.body.radioFechas == 'Hoy') {
        consultaSQL = consultaSQL + ' AND fecha = "' + ahora.fechaActual() + '"';
    } else {
        if (req.body.radioFechas == 'entreFechas') {

            if (req.body.desdeFecha == '') {
                req.flash('error', 'Debe ingresar fecha desde');
                return res.redirect('/consultarMensajesEnviados');
            }
            if (req.body.fechaHasta == '') {
                req.flash('error', 'Debe ingresar fecha hasta');
                return res.redirect('/consultarMensajesEnviados');
            }
            if (new Date(req.body.fechaDesde) > new Date(req.body.fechaHasta)) {
                req.flash('error', 'La fecha hasta debe ser posterior a la fecha desde');
                return res.redirect('/consultarMensajesEnviados');
            }

            consultaSQL = consultaSQL + ' AND fecha BETWEEN "' + req.body.desdeFecha + '"' + ' AND "' + req.body.hastaFecha + '"';
        }
    }

  

    // Valido Destinatario

    if (req.body.destinatario != 'Todos') {
        consultaSQL = consultaSQL + ' AND destinatario = "' + req.body.destinatario + '"';
    }

    // Valido estado

    if (req.body.estado != 'Todos') {
        consultaSQL = consultaSQL + ' AND estado = "' + req.body.estado + '"';
    }

    consultaSQL = consultaSQL + 'ORDER BY fecha DESC, hora DESC'; 

    const resultado = await db.query(consultaSQL);

    return res.render('detalleMensajesEnviados',{resultado: resultado, helpers: {
        fechaNormalizada: (fecha)=> {
            return ahora.convertirAFechaNormal(fecha);
        }
    }})


});

module.exports = router