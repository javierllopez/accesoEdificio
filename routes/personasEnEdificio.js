const express = require('express');
const router = express.Router();
const passport = require('passport');
const { accesoNivel1 } = require('../lib/autenticar');
const db = require('../baseDeDatos');
const ahora = require('../lib/ahora');


router.get('/', accesoNivel1, async (req, res, next) => {

    const detalle = await db.query('SELECT * FROM edificios WHERE administrador = ?', [req.user.id]);
    res.render('consultaPersonasEnEdificio', { edificio: detalle });

})

router.post('/', accesoNivel1, async (req, res, next) => {

    const edificio = await db.query('SELECT * FROM edificios WHERE id = ?',[req.body.edificio]);
    
    const esteEdificio = await db.query('SELECT * FROM personasenedificio WHERE idEdificio = ?', [req.body.edificio])

    const cantidad = await db.query('SELECT COUNT(*) as Total FROM personasenedificio WHERE idEdificio = ?', [req.body.edificio]);

    console.log(cantidad);

    return res.render('personasEnEdificio', {edificio: edificio[0].descripcion,detalle: esteEdificio, Total: cantidad[0].Total})
});

module.exports = router