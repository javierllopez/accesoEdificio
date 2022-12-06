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


    let consultaSQL = 'SELECT username as username, fecha as fecha, hora as hora, edificio as edificio, edificios.descripcion as descripcion, actividad as actividad FROM historiallogueo INNER JOIN edificios ON edificio = edificios.id WHERE  username = ?';

    if (req.body.radioFechas == 'Hoy') {
        consultaSQL = consultaSQL + ' AND fecha = "'+ ahora.fechaActual() + '"'
    } else {
        if (req.body.radioFechas == 'entreFechas') {
            consultaSQL = consultaSQL + ' AND fecha BETWEEN "'+ req.body.fechaDesde+'" AND "'+req.body.fechaHasta+'"';
        }
    }

    consultaSQL = consultaSQL + ' ORDER BY fecha DESC, hora DESC'
    const detalle = await db.query(consultaSQL, [req.body.usuario]);

    return res.render('detalleHistorialDeLogueo', {
        fechaDesde: req.body.fechaDesde, 
        fechaHasta: req.body.fechaHasta, 
        username: req.body.usuario, 
        detalle: detalle,
        helpers: {
            fechaNormalizada: (miFecha) => {
                return ahora.convertirAFechaNormal(miFecha);
            },
            horaNormalizada: (miHora) => {
                let resultado = miHora // new Intl.DateTimeFormat(undefined,{timeStyle:"short"}).format(new Date(miHora));
                console.log(miHora);
                return resultado;
            }
        }
    });
})

module.exports = router