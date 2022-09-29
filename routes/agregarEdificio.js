const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/',accesoNivel1, async (req,res,next)=> {

    res.render('agregarEdificio');
});
router.post('/',accesoNivel1,async (req,res,next)=> {

    if (req.body.denominacionEdificio == '') {
        req.flash('error','Debe ingresar una denominación para el edificio');
        return res.redirect('/');
    }
    if (req.body.domicilioEdificio == '') {
        req.flash('error','Debe ingresar el domicilio del edificio');
        return res.redirect('/');
    }
    if (req.body.localidadEdificio == '') {
        req.flash('error','Debe ingresar la localidad del edificio');
        return res.redirect('/');
    }
    
    const nuevoEdificio = {
        descripcion: req.body.denominacionEdificio,
        domicilio: req.body.domicilioEdificio,
        localidad: req.body.localidadEdificio,
        administrador: req.user.id
    }

    const nuevoEdificiosUsuarios = {
        idUsuario: req.user.username,
        idAdmin: req.user.username
    }

    const resultado = await db.query('INSERT INTO edificios SET ?',[nuevoEdificio]);

    nuevoEdificiosUsuarios.idEdificio = resultado.insertId,

    await db.query('INSERT INTO edificiosusuarios SET ?',[nuevoEdificiosUsuarios]);
    
    req.flash('mensaje','Edificio agregado exitosamente');   
    res.redirect('/edificios');

});

module.exports = router