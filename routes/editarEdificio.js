const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/:idEdificio', accesoNivel1,async (req,res,next)=> {
    const id = req.params;

    const edificio = await db.query('SELECT * FROM edificios WHERE id = ?',[id.idEdificio]);
    return res.render('editarEdificio',{edificio:edificio[0]});
 
});
router.post('/:idEdificio',accesoNivel1,async (req,res,next)=> {
    const id = req.params.idEdificio;
    const nuevoEdificio = {
        descripcion: req.body.denominacionEdificio,
        domicilio: req.body.domicilioEdificio,
        localidad: req.body.localidadEdificio,
        administrador: req.user.id
    }

    const resultado = await db.query('UPDATE edificios SET ? WHERE id = ?',[nuevoEdificio,id]);
    req.flash('mensaje','Edificio modificado exitosamente');
    return res.redirect('/edificios');
});

module.exports = router