const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const { accesoNivel1 } = require('../lib/autenticar');
const ahora = require('../lib/ahora');

router.get('/', accesoNivel1, async (req, res, next) => {
    const sqlString = 'SELECT idUsuario as idUsuario, idAdmin as idAdmin, usuarios.acceso as acceso FROM edificiosusuarios INNER JOIN usuarios ON edificiosusuarios.idUsuario = usuarios.username WHERE idAdmin = ?  AND acceso > 1 ORDER BY idUsuario'
    const detalle = await db.query(sqlString, [req.user.username]);

    return res.render('consultaHistorialDeLogueo', {
        usuarios: detalle
    });
})

router.post('/', async (req, res, next) => {


    const consultaSQL = 'SELECT username as username, fecha as fecha, hora as hora, edificio as edificio, edificios.descripcion as descripcion, actividad as actividad FROM historiallogueo INNER JOIN edificios ON edificio = edificios.id WHERE fecha BETWEEN ? AND ? AND username = ?'

    const detalle = await db.query(consultaSQL, [req.body.fechaDesde, req.body.fechaHasta, req.body.usuario]);

    console.log(detalle);

    return res.render('detalleHistorialDeLogueo', {
        fechaDesde: req.body.fechaDesde, fechaHasta: req.body.fechaHasta, username: req.body.usuario, detalle: detalle,
        helpers: {
            fechaNormalizada: (miFecha) => {
                return ahora.convertirAFechaNormal(miFecha);
            }
        }
    });
})

module.exports = router