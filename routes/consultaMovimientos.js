const express = require('express');
const router = express.Router();
const passport = require('passport');
const { accesoNivel1 } = require('../lib/autenticar');
const db = require('../baseDeDatos');
const ahora = require('../lib/ahora');


router.get('/', accesoNivel1, async (req, res, next) => {

    const edificio = await db.query('SELECT * FROM edificios WHERE administrador = ?', [req.user.id]);
    res.render('consultaMovimientos', { edificio: edificio });
})

router.post('/', accesoNivel1, async (req, res, next) => {
    const fecha = new Date(req.body.fecha);
    
    const esteEdificio = await db.query('SELECT descripcion FROM edificios WHERE id = ?', [req.body.edificio])

    const resultado = await db.query('SELECT * FROM registroactividad WHERE fecha = ? AND idEdificio = ? ORDER BY hora', [req.body.fecha, req.body.edificio]);

    const entradas = await db.query('SELECT actividad, COUNT(*) as Total FROM registroactividad WHERE fecha = ? AND idEdificio = ? GROUP BY actividad', [req.body.fecha, req.body.edificio]);

    return res.render('detalleMovimientos', {
        edificio: esteEdificio[0].descripcion, fecha: req.body.fecha, detalle: resultado, acciones: entradas, helpers: {
            color: (accion) => {
                if (accion == 'Ingreso') return '#02FA11';
                if (accion == "Salida") return '#FA0D02';
            }
        }
    })
});

module.exports = router